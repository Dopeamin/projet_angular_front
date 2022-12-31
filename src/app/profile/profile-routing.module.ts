import { environment } from "@/environments/environment";
import { RouterModule, Routes } from "@angular/router";
import getTitle from "../helpers/getTitle";
import { AuthGuard } from "../services/auth/auth-guard.guard";
import { ProfileComponent } from "./profile.component";

const routes: Routes = [
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuard],
    title: getTitle("Profile")
  },
  {
    path: "profile/:id",
    component: ProfileComponent,
    canActivate: [AuthGuard],
    title: getTitle("Profile")
  }
];

export const ProfileRoutingModule = RouterModule.forChild(routes);
