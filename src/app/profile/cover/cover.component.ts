import { ChatService } from "@/app/services/chat/chat.service";
import { FriendshipsService } from "@/app/services/friendships/friendships.service";
import { Profile } from "@/types/profile.type";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-cover",
  templateUrl: "./cover.component.html",
})
export class CoverComponent implements OnInit {
  @Input()
  profile?: Profile;

  @Input()
  me: boolean = true;

  constructor(
    private readonly friendshipService: FriendshipsService,
    private readonly chatService: ChatService,
    private readonly router: Router,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void { }

  sendFriendRequest() {
    if (this.profile) {
      this.friendshipService
        .sendFriendRequest(this.profile.id)
        .then(() => this.showSuccess())
        .catch((e) => {
          console.error(e);
          const errorMessage =
            e.error.message?.join?.(" ") ||
            e.error.message ||
            "An error has occured, Please try again later";
          this.showError(errorMessage);
        });
    }
  }

  async openChat() {
    if (this.profile) {
      this.chatService.getChatWith(this.profile.id)
        .then(chat => {
          this.router.navigate(["messenger", chat.id])
        })
        .catch(e => {
          console.error(e);
          const errorMessage =
            e.error.message?.join?.(" ") ||
            e.error.message ||
            "An error has occured, Please try again later";
          this.showError(errorMessage);
        })
    }
  }

  showSuccess() {
    this.toastrService.success("Invitation successful!", "Friend request sent");
  }

  showError(message: string) {
    this.toastrService.error("Invitation Failed!", message);
  }
}
