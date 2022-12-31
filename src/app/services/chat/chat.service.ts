import { objectToFormdata } from '@/app/helpers/objectToFormdata';
import { environment } from '@/environments/environment';
import { Chat, GroupChatToProfile, Message } from '@/types/chat.type';
import { Profile } from '@/types/profile.type';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { firstValueFrom, map, Subject, Observable, filter } from 'rxjs';
import { CryptographyService } from '../cryptography/cryptography.service';
import { Endpoints } from '../http/endpoints';
import { HttpService } from '../http/http.service';
import { LocaleService } from '../locale/locale.service';
import { SoundService } from '../sound/sound.service';
import { CreateGroupChatDTO } from './create-chat.dto';
import { SendMessageDto } from './send-message.dto';
import { UpdateMemberDto } from './update-member.dto';

export type ChatMap = { [key: string]: Chat };
export type LastMessageSeen = { id: string, profile: Profile };
type IncomingMessage = { groupChatId: string, message: Message };
@Injectable({
  providedIn: 'root'
})
export class ChatService extends Socket {
  public static readonly PAGE_SIZE = 24;
  private chatsSubject: Subject<ChatMap> = new Subject();
  private chats: ChatMap = {};
  private page = 1;
  public hasMore = true;
  public loadingChats = false;
  chatsSubject$ = this.chatsSubject.asObservable();

  constructor(
    private httpService: HttpService,
    private localService: LocaleService,
    private cryptographyService: CryptographyService,
    private soundService: SoundService
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
    this.getNextChats();
    this.preProcessChat = this.preProcessChat.bind(this);
    this.preProcessMessage = this.preProcessMessage.bind(this);
    this.processMessageBlock = this.processMessageBlock.bind(this);
  }

  public async updateChatName(id: string, name: string) {
    const chat = await firstValueFrom(
      await this.httpService.patch<Chat>(Endpoints.Chat + id, { id, name })
    );
    this.chats[chat.id].name = chat.name;
    this.chats[chat.id] = { ...this.chats[chat.id] };
    this.chatsSubject.next(this.chats);
    return this.chats[chat.id];
  }

  public subscribeToIncomingMessages() {
    const me = this.localService.getUser().profile;
    return this.fromEvent<IncomingMessage>("message").pipe(
      map(async (data: IncomingMessage) => {
        const groupChatId = data.groupChatId;
        const chat = await this.getChat(groupChatId);
        const processedMessage = this.preProcessMessage(data.message, chat);
        const added = this.saveNewMessageInChat(processedMessage, chat);

        /* Fixing chat pagination due to new message */
        if (added) {
          chat.pageSize++;
          this.reorderChats();
          if (processedMessage.profile.id !== me.id) {
            this.soundService.playMessageSound();
          }
        }
        if (processedMessage.data.text || processedMessage.data.attachments?.length > 0)
          chat.lastMessage = processedMessage;

        if (chat.pageSize === 2 * ChatService.PAGE_SIZE) {
          chat.page = chat.page + 1;
          chat.pageSize = ChatService.PAGE_SIZE;
        }

        this.chatsSubject.next(this.chats);
        return data.message;
      })
    )
  }

  private reorderChats() {
    const chats = this.getChatList();
    chats.sort((a, b) => {
      if (a.lastMessage && b.lastMessage) {
        return +b.lastMessage.createdAt - +a.lastMessage.createdAt;
      } else if (a.lastMessage) {
        return 1;
      }
      return -1;
    });
    this.chats = {};
    chats.forEach(chat => this.chats[chat.id] = chat);
  }

  private saveNewMessageInChat(message: Message, chat: Chat) {
    const myId = this.localService.getUser().profile.id;
    const messageIndex = chat.messages.findIndex(
      m => m.id === message.id
    );
    const tempMessageIndex = chat.messages.findIndex(
      m => m.id === "temp"
    );
    if (messageIndex !== -1) {
      chat.messages[messageIndex] = message;
      return false;
    } else if (tempMessageIndex === -1 || message.profile.id !== myId) {
      chat.messages.unshift(message);
      return true;
    }
    return false;
  }

  private saveOldMessageInChat(message: Message, chat: Chat) {
    const messageIndex = chat.messages.findIndex(
      m => m.id === message.id
    );
    if (messageIndex !== -1) {
      chat.messages[messageIndex] = message;
    } else {
      chat.messages.push(message);
    }
  }

  public async getNextMessages(chatGroupId: string) {
    const chat = await this.getChat(chatGroupId);
    if (!chat?.hasMore) return [];
    const page = chat.page;
    const messages = await firstValueFrom(
      (await this.httpService.get<Message[]>(Endpoints.Messages + chatGroupId, {
        limit: chat.pageSize,
        page
      })).pipe(
        map(messages => messages.map(
          message => {
            const m = this.preProcessMessage(message, chat);
            this.saveOldMessageInChat(m, chat);
            return m;
          }
        ))
      )
    )
    chat.page = page + 1;
    chat.hasMore = messages.length === chat.pageSize;
    this.chats[chatGroupId] = chat;
    this.chatsSubject.next(this.chats);
    return messages;
  }

  public subscribeToChat(chatGroupId: string): Observable<Chat> {
    if (this.chats[chatGroupId]) {
      this.getChat(chatGroupId);
    }
    return this.chatsSubject$.pipe(
      map(chats => chats[chatGroupId]),
      filter(chat => !!chat)
    );
  }

  private prepareMessageDto(sendMessageDto: SendMessageDto) {
    if (!sendMessageDto.text) return;
    const chat = this.chats[sendMessageDto.groupChatId];
    if (!chat.symmetricKey) return;
    const encryptedText = this.cryptographyService.encryptMessage(
      sendMessageDto.text,
      chat.symmetricKey
    );
    sendMessageDto.text = encryptedText;
    sendMessageDto.isEncrypted = true;
  }

  public async deleteMessage(messageId: string, chatGroupId: string) {
    await firstValueFrom(
      await this.httpService.delete(Endpoints.DeleteMessage + messageId)
    );
    const chat = this.chats[chatGroupId];
    const messageIndex = chat.messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      chat.messages[messageIndex].data = {}
      this.chatsSubject.next(this.chats);
    }
  }


  public async sendMessage(sendMessageDto: SendMessageDto) {
    const oldText = sendMessageDto.text;
    this.prepareMessageDto(sendMessageDto);
    const placeHolderMessage = {
      createdAt: new Date(),
      id: "temp",
      data: {
        text: oldText,
        attachments: sendMessageDto.files?.map(file => ({
          url: file.src,
          type: file.type,
        }))
      },
      isSending: true,
      seenByMe: true,
      profile: this.localService.getUser().profile,
    } as Message;
    const chat = this.chats[sendMessageDto.groupChatId];
    chat.messages.unshift(placeHolderMessage)
    this.chatsSubject.next(this.chats);

    const formdata = objectToFormdata(sendMessageDto);
    const message = await firstValueFrom(
      await this.httpService.post<Message>(Endpoints.SendMessage, formdata)
    );
    const tempMessageIndex = chat.messages.findIndex(m => m === placeHolderMessage);
    this.preProcessMessage(message, chat);
    chat.messages[tempMessageIndex] = message
    this.reorderChats();
    this.chatsSubject.next(this.chats);
  }

  public markAsSeen(message: Message) {
    const user = this.localService.getUser();
    if (!message.seenByMe) {
      this.emit("mark-as-seen", message.id);
    }
  }

  public getChatList() {
    return Object.values(this.chats);
  }

  private preProcessMessage(message: Message, chat: Chat) {
    if (!message) return {} as Message;
    if (message.data.text && message.isEncrypted)
      try {
        message.data.text = this.cryptographyService.decryptMessage(
          message.data.text,
          chat.symmetricKey
        );
      } catch (error) {
      }

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
    if (!chat) return null;
    const user = this.localService.getUser();
    const oldChat = this.chats[chat.id];
    try {
      if (oldChat?.symmetricKey) {
        chat.symmetricKey = oldChat.symmetricKey;
      } else {
        const encryptedSymmetricKey = chat.groupChatToProfiles.find(
          gcp => gcp.profile.id === user.profile.id
        ).encryptedSymmetricKey;
        const privateKey = this.cryptographyService.decryptPrivateKey(
          user.encryptedPrivateKey,
          user.password
        );
        const symmetricKey = this.cryptographyService.decryptSymmetricKey(
          encryptedSymmetricKey,
          privateKey,
        );
        chat.symmetricKey = symmetricKey;
      }
    } catch (error) {
    }
    chat.createdAt = new Date(chat.createdAt);
    chat.updatedAt = new Date(chat.updatedAt);
    chat.pageSize = ChatService.PAGE_SIZE;
    chat.messages = oldChat?.messages || [];
    chat.messageBlocks = oldChat?.messageBlocks || [];
    chat.hasMore = true;
    chat.page = 1;
    chat.lastMessage = this.preProcessMessage(chat.lastMessage, chat);
    this.chats[chat.id] = chat;
    return chat;
  }

  public async getNextChats() {
    if (!this.hasMore)
      return [];
    this.loadingChats = true;
    const promise = this.httpService.get<Chat[]>(Endpoints.Chats, {
      limit: ChatService.PAGE_SIZE,
      page: this.page++
    });
    const response = await firstValueFrom(
      (await promise).pipe(
        map(chats => chats.map(this.preProcessChat))
      )
    );
    if (response.length < ChatService.PAGE_SIZE) {
      this.hasMore = false;
    }
    this.reorderChats();
    this.loadingChats = false;
    this.chatsSubject.next(this.chats);
    return response;
  }

  public async getChatWith(profileId: string) {
    const promise = this.httpService.get<Chat>(Endpoints.ChatWith + profileId);
    const response = await firstValueFrom(
      (await promise).pipe(
        map(this.preProcessChat)
      )
    );
    this.reorderChats();
    this.chatsSubject.next(this.chats);
    return response;
  }

  async getChat(id: string, update = false) {
    let res = this.chats[id];
    if (update || !res) {
      const promise = this.httpService.get<Chat>(Endpoints.Chat + id);
      const response = await firstValueFrom(
        (await promise).pipe(map(this.preProcessChat))
      );
      this.reorderChats();
      this.chatsSubject.next(this.chats);
      return response;
    }
    return res;
  }

  public getCurrentChats() {
    return this.chats;
  }


  public processMessageBlock(block: Message[]) {
    // for each message we subdivide it into 2 parts if it got attachments
    // so that we can display them in the chat head
    const messages: Message[] = [];
    for (let i = 0; i < block.length; i++) {
      const message = block[i];
      if (message.data?.attachments?.length > 0) {
        let attachments = message.data.attachments;
        attachments = attachments.map(attachment => ({
          ...attachment,
          url: message.id === 'temp' ? attachment.url : this.httpService.getFullUrl(attachment.url)
        }));
        const attachmentMessage = {
          ...message,
          data: {
            attachments
          }
        };
        messages.push(attachmentMessage);
      }
      if (message.data?.text)
        messages.push({
          ...message,
          data: {
            text: message.data.text
          }
        });
      if (!message.data?.text && !message.data?.attachments?.length)
        messages.push(message);
    }

    return messages;
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

    return blocks.map(this.processMessageBlock);
  }

  public async updateGroupMember(chatId: string, updateMemberDto: UpdateMemberDto) {
    const response = await firstValueFrom<GroupChatToProfile>(
      await this.httpService.patch(Endpoints.UpdateGroupMember + chatId, updateMemberDto)
    );
    const chat = await this.getChat(chatId);
    chat.groupChatToProfiles = chat.groupChatToProfiles.map(
      gctp => gctp.id === response.id ? response : gctp
    );
    this.chats[chatId] = { ...chat };
    this.chatsSubject.next(this.chats);
    return chat;
  }

  public async createGroupChat(members: Profile[], name?: string) {
    const me = this.localService.getUser().profile;
    const createGroupChatDto = {} as CreateGroupChatDTO;
    createGroupChatDto.name = name;

    const symmetricKey = this.cryptographyService.generateSymmetricKey();
    createGroupChatDto.encryptedSymmetricKey =
      this.cryptographyService.encryptSymmetricKey(me.publicKey, symmetricKey);

    createGroupChatDto.members = members.map(member => {
      const encryptedSymmetricKey =
        this.cryptographyService.encryptSymmetricKey(member.publicKey, symmetricKey);
      return {
        id: member.id,
        encryptedSymmetricKey
      }
    });

    const response = await firstValueFrom<Chat>(
      await this.httpService.post(Endpoints.CreateGroupChat, createGroupChatDto)
    );
    return response;
  }
}
