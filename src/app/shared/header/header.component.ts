import { FriendshipsService } from "@/app/services/friendships/friendships.service";
import { ProfileService } from "@/app/services/profile/profile.service";
import { SoundService } from "@/app/services/sound/sound.service";
import { Friendship } from "@/types/friendship.type";
import { Profile } from "@/types/profile.type";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "messenger-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  @Input()
  title = "Messaging";

  isDropdownOpen = false;
  isNotificationsOpen = false;
  isSearchOpen = false;
  searchQuery = "";
  timeoutId: any;

  profile: Profile;
  profiles: Profile[] = [];
  interval: NodeJS.Timer;

  incomingRequests: Friendship[] = [];

  constructor(
    private readonly profileService: ProfileService,
    private readonly friendshipService: FriendshipsService,
    private readonly soundService: SoundService,
  ) {
    this.getIncomingRequests = this.getIncomingRequests.bind(this);
  }

  ngOnInit(): void {
    this.profile = this.profileService.getMyProfile();
    this.getIncomingRequests();
    this.interval = setInterval(() => this.getIncomingRequests().then(new_ =>
      new_ && this.soundService.playNotificationSound()
    ), 3000);
  }

  async getIncomingRequests() {
    return this.friendshipService.getFriendships("incoming", "pending").then((incomingRequests) => {
      if (JSON.stringify(this.incomingRequests) !== JSON.stringify(incomingRequests)) {
        const bool = this.areThereNewRequests(incomingRequests);
        this.incomingRequests = incomingRequests;
        return bool;
      }
      return false;
    })
  }

  areThereNewRequests(requests: Friendship[]) {
    return requests.some((request) => !this.incomingRequests.some((oldRequest) => oldRequest.id === request.id));
  }

  onAvatarClick() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onSearch($event: any) {
    const query = $event.target.value.trim();
    const changed = query !== this.searchQuery;
    this.searchQuery = query;
    if (!changed || !query) return;
    this.searchQuery = query;
    this.isSearchOpen = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(async () => {
      this.profiles = await this.profileService.getProfiles(query);
      this.timeoutId = null;
    }, 250);
  }

  onNotificationsClick() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }

  handleNotificationsToggle(event: boolean) {
    this.isNotificationsOpen = event;
  }

  handleSearchToggle(event: boolean) {
    this.isSearchOpen = event;
  }

  handleToggle(event: boolean) {
    this.isDropdownOpen = event;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
