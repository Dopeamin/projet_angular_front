import { FriendshipsService } from '@/app/services/friendships/friendships.service';
import { Friendship } from '@/types/friendship.type';
import { Profile } from '@/types/profile.type';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {

  @Input()
  isOpen: boolean = false;

  @Output()
  toggle: EventEmitter<boolean> = new EventEmitter();

  @Input()
  incomingRequests: Friendship[] = [];

  constructor(
    private readonly friendshipService: FriendshipsService,
  ) {}

  ngOnInit(): void {
  }

  onClick() {
    this.toggle.emit(!this.isOpen);
  }

  async acceptRequest(profile: Profile) {
    const req = await this.friendshipService.acceptFriendRequest(profile);
    if (req.status === "accepted") {
      this.incomingRequests = this.incomingRequests.filter((request) => request.sender.id !== profile.id);
    }
  }

  async declineRequest(id: string) {
    const req = await this.friendshipService.declineFriendRequest(id);
    if (req.status === "rejected") {
      this.incomingRequests = this.incomingRequests.filter((request) => request.sender.id !== id);
    }
  }
}
