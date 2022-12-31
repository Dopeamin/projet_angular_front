import { RouterModule, Routes } from "@angular/router";
import getTitle from "../helpers/getTitle";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    title: getTitle("Login"),
  },
  {
    path: "register",
    component: RegisterComponent,
    title: getTitle("Register"),
  }
];

export const AuthRoutingModule = RouterModule.forChild(routes);
