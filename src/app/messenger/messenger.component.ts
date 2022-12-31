import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
})
export class MessengerComponent implements OnInit {
  subscriptions = [];
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly chatService: ChatService,
  ) {
  }

  ngOnInit(): void {
    this.redirectIfNoChat();
    const sub = this.chatService.chatsSubject$.subscribe(() => {
      this.redirectIfNoChat();
    });
    this.subscriptions.push(sub);
  }

  redirectIfNoChat() {
    const chats = this.chatService.getChatList();
    if (chats.length !== 0 && !this.route?.firstChild?.snapshot?.params['id']) {
      this.router.navigate(['messenger', chats[0].id]);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
