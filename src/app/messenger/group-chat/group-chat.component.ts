import { ChatService } from '@/app/services/chat/chat.service';
import { FriendshipsService } from '@/app/services/friendships/friendships.service';
import { ProfileService } from '@/app/services/profile/profile.service';
import { Profile } from '@/types/profile.type';
import { Component, Input, OnInit } from '@angular/core';

type SelectableProfile = Profile & { isSelected?: boolean };

@Component({
  selector: 'group-chat-modal',
  templateUrl: './group-chat.component.html'
})
export class GroupChatComponent implements OnInit {
  @Input()
  isVisible = false;
  @Input()
  onClose: () => void;
  me: Profile;
  friends: SelectableProfile[] = [];
  members: SelectableProfile[] = [];
  initialize = true;
  query = '';
  timeoutId?: NodeJS.Timeout;
  name?: string;

  constructor(
    private readonly friendshipService: FriendshipsService,
    private readonly profileService: ProfileService,
    private readonly chatService: ChatService
  ) {
    this.onSubmit = this.onSubmit.bind(this);
    this.me = this.profileService.getMyProfile();
  }

  async init() {
    return this.friendshipService.getFriendships('all', 'accepted', this.query).then(
      (friendships) => {
        this.friends = friendships.map((friendship) =>
          friendship.sender.id === this.me.id ? friendship.receiver : friendship.sender
        );
      }
    )
  }

  toggleMember(member: SelectableProfile) {
    member.isSelected = !member.isSelected;
    if (member.isSelected) {
      this.members.push(member);
    } else {
      this.members = this.members.filter((m) => m.id !== member.id);
    }
  }

  ngDoCheck() {
    if (this.isVisible && this.initialize) {
      this.init();
      this.initialize = false;
    }
  }

  async onSubmit() {
    this.name = this.name?.trim();
    await this.chatService.createGroupChat(this.members, this.name || undefined);
    this.onClose();
    this.members = [];
    this.query = '';
    this.friends = [];
    this.name = '';
    this.initialize = true;
  }

  onSearchChange($event: any) {
    const query = $event.target.value;
    const changed = query !== this.query;
    if (!changed) return;
    this.query = query;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(async () => {
      await this.init();
      this.timeoutId = null;
    }, 250);
  }

  ngOnInit(): void {
  }

}
