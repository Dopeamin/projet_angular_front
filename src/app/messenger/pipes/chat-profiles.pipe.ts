import { ProfileService } from '@/app/services/profile/profile.service';
import { Chat } from '@/types/chat.type';
import { Profile } from '@/types/profile.type';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatProfiles'
})
export class ChatProfilesPipe implements PipeTransform {

  constructor(
    private profileService: ProfileService
  ) { }

  transform(chat: Chat, n: number = 1): Profile[] {
    const me = this.profileService.getMyProfile();
    const chatToProfiles = chat.groupChatToProfiles.filter((c) => c.profile.id !== me.id);
    return chatToProfiles.slice(0, n).map((c) => c.profile);
  }

}
