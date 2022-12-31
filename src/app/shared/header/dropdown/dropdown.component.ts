import { AuthService } from "@/app/services/auth/auth.service";
import { LocaleService } from "@/app/services/locale/locale.service";
import { ProfileService } from "@/app/services/profile/profile.service";
import User from "@/types/user.type";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HeroIconName } from "ng-heroicon";

export type DropDownItem = {
  title: string;
  route: string;
  icon: HeroIconName;
  onClick?: () => void;
};

@Component({
  selector: "app-dropdown",
  templateUrl: "./dropdown.component.html",
})
export class DropdownComponent implements OnInit {
  @Input()
  isOpen: boolean = false;

  @Output()
  toggle: EventEmitter<boolean> = new EventEmitter();

  dropDownItems?: DropDownItem[];
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly profileService: ProfileService
  ) {
    this.logout = this.logout.bind(this);
  }

  ngOnInit(): void {
    const profile = this.profileService.getMyProfile();
    this.dropDownItems = [
      { title: "Profile", route: `/profile/${profile.id}`, icon: "user" },
      { title: "Messenger", route: "/messenger", icon: "chat" },
      // { title: "Settings", route: "/settings", icon: "cog" },
      {
        title: "Logout",
        route: "/logout",
        icon: "logout",
        onClick: this.logout,
      },
    ];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  onClick() {
    this.toggle.emit(!this.isOpen);
  }
}
