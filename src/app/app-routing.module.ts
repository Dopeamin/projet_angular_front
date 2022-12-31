import { RouterModule, Routes } from "@angular/router";

const GLOBAL_ROUTES: Routes = [
  {
    path: "",
    redirectTo: "messenger",
    pathMatch: "full"
  },
  {
    path: "**",
    redirectTo: "messenger"
  }
];

export const AppRoutingModule = RouterModule.forRoot(GLOBAL_ROUTES);