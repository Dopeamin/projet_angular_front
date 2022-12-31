import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessengerComponent } from "./messenger.component";
import { MessagesComponent } from "./messages/messages.component";
import { MessengerRoutingModule } from "./messenger-routing.module";
import { ChatsComponent } from "./chats/chats.component";
import { SharedModule } from "../shared/shared.module";
import { ChatItemComponent } from "./chat-item/chat-item.component";
import { ChatHeadComponent } from "./chat-head/chat-head.component";
import { FormsModule } from "@angular/forms";
import { ChatInputComponent } from "./chat-input/chat-input.component";
import { ChatNamePipe } from "./pipes/chat-name.pipe";
import { GroupChatComponent } from './group-chat/group-chat.component';
import { ChatProfilesPipe } from './pipes/chat-profiles.pipe';
import { ChatEmptyComponent } from './chat-empty/chat-empty.component';
import { SkeletonComponent } from './chat-item/skeleton/skeleton.component';
@NgModule({
  declarations: [
    MessengerComponent,
    MessagesComponent,
    ChatsComponent,
    ChatItemComponent,
    ChatHeadComponent,
    ChatInputComponent,
    ChatNamePipe,
    GroupChatComponent,
    ChatProfilesPipe,
    ChatEmptyComponent,
    SkeletonComponent,
  ],
  imports: [
    CommonModule,
    MessengerRoutingModule,
    FormsModule,
    SharedModule,
  ],
})
export class MessengerModule {}
