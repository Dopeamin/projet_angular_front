import { ChatService } from '@/app/services/chat/chat.service';
import { UpdateMemberDto } from '@/app/services/chat/update-member.dto';
import { Chat, Message } from '@/types/chat.type';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'messenger-messages',
  templateUrl: './messages.component.html',
})
export class MessagesComponent {
  @ViewChild('messagesContainer')
  messagesContainer?: ElementRef;
  id = '';
  settings: boolean = true;
  chat?: Chat;
  messages: Message[][] = [];
  subscriptions: Subscription[] = [];
  loading = false;
  nickname: any = {};
  chatName = '';

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.init();
    });
  }

  private init() {
    if (this.messagesContainer) this.messagesContainer.nativeElement.scrollTop = 0;
    this.navigateIfNoChat();
    this.update();
    this.getMessages();
    const chatSub =
      this.chatService.subscribeToChat(this.id).subscribe(
        this.update.bind(this)
      );
    this.subscriptions.push(chatSub);
  }

  private navigateIfNoChat() {
    this.chatService.getChat(this.id).then(chat => {
      this.chat = chat;
      if (!this.chat) this.router.navigate(['messenger'])
    })
  }

  private update(chat?: Chat) {
    this.messages = this.chatService.getMessageBlocks(this.id);
    if (!chat) return;
    this.chat = chat;
    this.chat.groupChatToProfiles.forEach((member) => {
      this.nickname[member.id] = member.nickname;
    });
  }

  async getMessages() {
    if (this.loading) return;
    this.loading = true;
    await this.chatService.getNextMessages(this.id);
    this.loading = false;
  }

  updateChatName() {
    this.chatName = this.chatName.trim();
    if (this.chatName === this.chat?.name || !this.chatName) return;
    this.chatService.updateChatName(this.id, this.chatName);
  }

  toggleSettings() {
    this.settings = !this.settings;
  }

  updateNickname(id: string) {
    const updateMemberDto = new UpdateMemberDto(
      id,
      this.nickname[id]
    );
    this.chatService.updateGroupMember(this.id, updateMemberDto);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
