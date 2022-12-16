import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessengerComponent } from "./messenger.component";
import { MessagesComponent } from "./messages/messages.component";
import { MessengerRoutingModule } from "./messenger-routing.module";
import { ChatsComponent } from "./chats/chats.component";
import { HeaderComponent } from "./header/header.component";
import { SharedModule } from "../shared/shared.module";
import { ChatItemComponent } from "./chat-item/chat-item.component";
import { ChatHeadComponent } from "./chat-head/chat-head.component";
import { AppRoutingModule } from "../app-routing.module";
import { FormsModule } from "@angular/forms";
import { ChatInputComponent } from "./chat-input/chat-input.component";
import { ChatNamePipe } from "./pipes/chat-name.pipe";
@NgModule({
  declarations: [
    MessengerComponent,
    MessagesComponent,
    ChatsComponent,
    HeaderComponent,
    ChatItemComponent,
    ChatHeadComponent,
    ChatInputComponent,
    ChatNamePipe,
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    MessengerRoutingModule,
    FormsModule,
    SharedModule,
  ],
  exports: [HeaderComponent],
})
export class MessengerModule {}
