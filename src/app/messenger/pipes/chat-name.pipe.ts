import { LocaleService } from '@/app/services/locale/locale.service';
import { Chat } from '@/types/chat.type';
import { Profile } from '@/types/profile.type';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatName'
})
export class ChatNamePipe implements PipeTransform {

  constructor(
    private readonly localeService: LocaleService
  ) { }

  transform(chat?: Chat): string {
    if (!chat) return '';
    
    if (chat.name) return chat.name;
    
    const me = this.localeService.getUser();
    if (chat.isPrivate) {
      const user = chat.groupChatToProfiles.find(user => user.profile.id !== me.profile.id);
      if (user) {
        return user.nickname || this.getFullName(user.profile);
      }
      return '';
    } else {
      const users = chat.groupChatToProfiles.filter(user => user.profile.id !== me.profile.id);
      return users.map(user => user.nickname || user.profile.firstName).join(', ');
    }
  }

  getFullName(user: Profile) {
    return user.firstName + ' ' + user.lastName;
  }

}
