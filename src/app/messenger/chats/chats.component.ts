import { ChatService } from '@/app/services/chat/chat.service';
import { Chat } from '@/types/chat.type';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'messenger-chats',
  templateUrl: './chats.component.html',
})
export class ChatsComponent implements OnInit {
  chats: Chat[] = [];
  isGroupChatModalVisible = false;
  isOpen = true;
  constructor(
    public chatService: ChatService,
  ) {
    this.closeGroupChatModal = this.closeGroupChatModal.bind(this);
  }

  ngOnInit(): void {
    this.chats = this.chatService.getChatList();
    this.chatService.chatsSubject$.subscribe((_) => {
      this.chats = this.chatService.getChatList();
    });
  }

  closeGroupChatModal() {
    this.isGroupChatModalVisible = false;
  }

  toggleChatList() {
    this.isOpen = !this.isOpen;
  }

}
