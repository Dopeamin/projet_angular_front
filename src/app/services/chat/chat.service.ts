import { environment } from '@/environments/environment';
import { Chat, Message } from '@/types/chat.type';
import { Profile } from '@/types/profile.type';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { firstValueFrom, map, Subject, filter, Observable } from 'rxjs';
import { Endpoints } from '../http/endpoints';
import { HttpService } from '../http/http.service';
import { LocaleService } from '../locale/locale.service';
import { SendMessageDto } from './send-message.dto';

export type ChatMap = { [key: string]: Chat };
export type LastMessageSeen = { id: string, profile: Profile };
type IncomingMessage = { groupChatId: string, message: Message };
@Injectable({
  providedIn: 'root'
})
export class ChatService extends Socket {
  public static readonly PAGE_SIZE = 30;
  private chats: ChatMap = {};

  private chatsSubject: Subject<ChatMap> = new Subject();
  chatsSubject$ = this.chatsSubject.asObservable();

  constructor(
    private httpService: HttpService,
    private localService: LocaleService,
  ) {
    super({
      url: environment.wsUrl + '/chat', options: {
        withCredentials: true,
        transports: ['websocket'],
        query: {
          authorization: `Bearer ${localService.getToken()}`
        }
      }
    });
    this.connect();
    this.on("connect", () => {
      this.emit("connect-to-rooms");
      this.subscribeToIncomingMessages().subscribe();
    });
    this.getChats();
    this.preProcessChat = this.preProcessChat.bind(this);
    this.preProcessMessage = this.preProcessMessage.bind(this);
  }

  public subscribeToIncomingMessages() {
    return this.fromEvent<IncomingMessage>("message").pipe(
      map(async (data: IncomingMessage) => {
        const groupChatId = data.groupChatId;
        const chat = await this.getChat(groupChatId);

        /* Fixing chat pagination due to new message */
        chat.pageSize++;
        if (chat.pageSize === 2 * ChatService.PAGE_SIZE) {
          chat.page = chat.page + 1;
          chat.pageSize = ChatService.PAGE_SIZE;
        }

        const processedMessage = this.preProcessMessage(data.message, chat);
        this.putMessageInChat(processedMessage, chat);
        this.chatsSubject.next(this.chats);
        return data.message;
      })
    )
  }

  private putMessageInChat(message: Message, chat: Chat) {
    const messageIndex = chat.messages.findIndex(
      m => m.id === message.id
    );
    if (messageIndex !== -1) {
      chat.messages[messageIndex] = message;
    } else {
      chat.messages.unshift(message);
    }
  }


  public async getNextMessages(chatGroupId: string) {
    const chat = await this.getChat(chatGroupId);
    const page = chat.page;

    const messages = await firstValueFrom(
      (await this.httpService.get<Message[]>(Endpoints.Messages + chatGroupId, {
        limit: chat.pageSize,
        page
      })).pipe(
        map(messages => messages.map(
          message => this.preProcessMessage(message, chat)
        ))
      )
    );
    chat.messages = [...chat.messages, ...messages];
    chat.page = page + 1;
    chat.hasMore = messages.length === chat.pageSize;
    this.chatsSubject.next(this.chats);
    return messages;
  }

  public subscribeToChat(chatGroupId: string): Observable<Chat> {
    if (this.chats[chatGroupId]) {
      this.getChat(chatGroupId);
    }
    return this.chatsSubject$.pipe(
      map(chats => chats[chatGroupId])
    );
  }

  public sendMessage(sendMessageDto: SendMessageDto) {
    this.emit("send-message", sendMessageDto);
  }

  public markAsSeen(message: Message) {
    const user = this.localService.getUser();
    if (!message.seenByMe) {
      this.emit("mark-as-seen", message.id);
      console.log("Marking as seen");
      
    }
  }

  public getChatList() {
    return Object.values(this.chats);
  }

  private chatsToMap(chats: Chat[]) {
    const map: ChatMap = {};
    chats.forEach(chat => map[chat.id] = chat);
    return map;
  }

  private preProcessMessage(message: Message, chat: Chat) {
    message.createdAt = new Date(message.createdAt);
    message.updatedAt = new Date(message.updatedAt);
    message.seenByMe = !!message.seen[this.localService.getUser().profile.id];
    message.profile = chat.groupChatToProfiles.find(
      member => member.profile.id === message.profile.id
    )?.profile || message.profile;
    for (const id in message.seen) {
      const user = this.localService.getUser();
      if (id === user.profile.id) {
        delete message.seen[id];
      }
      const gctp = chat.groupChatToProfiles.find(
        member => member.profile.id === id
      );
      if (gctp) {
        const latestSeenMessage = gctp.latestSeenMessage;
        if (!latestSeenMessage || latestSeenMessage.createdAt <= message.createdAt) {
          delete latestSeenMessage?.seen[id];
          gctp.latestSeenMessage = message;
        } else {
          delete message.seen[id];
        }
      }
    }
    return message;
  }

  private preProcessChat(chat: Chat) {
    chat.createdAt = new Date(chat.createdAt);
    chat.updatedAt = new Date(chat.updatedAt);
    chat.pageSize = ChatService.PAGE_SIZE;
    chat.messages = this.chats[chat.id]?.messages || [];
    chat.hasMore = true;
    chat.page = 1;
    return chat;
  }

  public async getChats() {
    const response = await firstValueFrom(
      (await this.httpService.get<Chat[]>(Endpoints.Chats)).pipe(
        map(chats => chats.map(this.preProcessChat))
      )
    );
    this.chats = this.chatsToMap(response);
    this.chatsSubject.next(this.chats);
    return response;
  }

  private async getChat(id: string, update = false) {
    let res = this.chats[id];
    if (update || !res) {
      const response = await firstValueFrom(
        (await this.httpService.get<Chat>(Endpoints.Chat + id)).pipe(
          map(this.preProcessChat)
        )
      );

      this.chats[id] = response;
      this.chatsSubject.next(this.chats);
      return response;
    }
    return res;
  }

  public getCurrentChats() {
    return this.chats;
  }

  public getMessageBlocks(groupChatId: string): Message[][] {
    const messages = this.chats[groupChatId]?.messages;
    if (!messages)
      return [];
    const blocks: Message[][] = [];
    let block: Message[] = [];
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (block.length === 0) {
        block.push(message);
        continue;
      }
      const lastMessage = block[block.length - 1];
      if (lastMessage.profile.id === message.profile.id) {
        block.push(message);
      } else {
        blocks.push(block);
        block = [message];
      }
    }
    if (block.length > 0)
      blocks.push(block);
    return blocks;
  }
}
