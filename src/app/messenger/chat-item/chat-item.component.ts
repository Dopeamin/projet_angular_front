import { LocaleService } from '@/app/services/locale/locale.service';
import { Chat } from '@/types/chat.type';
import { Profile } from '@/types/profile.type';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'chat-item',
  templateUrl: './chat-item.component.html',
})
export class ChatItemComponent implements OnInit {
  lastMessageName: string = '';
  me?: Profile;

  @Input()
  chat?: Chat;

  constructor(
    private localeService: LocaleService,
  ) { }

  ngOnInit(): void {
  }

  ngDoCheck() {
    const profile = this.chat?.lastMessage?.profile;
    this.me = this.localeService.getUser()?.profile;
    if (profile?.id === this.me?.id) {
      this.lastMessageName = 'You';
    } else {
      this.lastMessageName = this.chat.groupChatToProfiles.find(
        (gctp) => gctp.profile.id === profile?.id
      )?.nickname || profile?.firstName.split(' ')[0];
    }
  }

}
