import { RouterModule, Routes } from "@angular/router";
import getTitle from "../helpers/getTitle";
import { AuthGuard } from "../services/auth/auth-guard.guard";
import { ChatEmptyComponent } from "./chat-empty/chat-empty.component";
import { MessagesComponent } from "./messages/messages.component";
import { MessengerComponent } from "./messenger.component";

export const MESSENGER_ROUTES: Routes = [
    {
        path: "messenger",
        component: MessengerComponent,
        children: [
            { path: "", component: ChatEmptyComponent },
            { path: ":id", component: MessagesComponent },
        ],
        title: getTitle("Messenger"),
        canActivate: [AuthGuard]
    }
];

export const MessengerRoutingModule = RouterModule.forChild(MESSENGER_ROUTES);