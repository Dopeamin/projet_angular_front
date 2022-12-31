import User from "@/types/user.type";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocaleService {
  constructor() { }

  public getToken() {
    return localStorage.getItem("token");
  }

  public setToken(token: string) {
    localStorage.setItem("token", token);
  }

  public getUser() {
    return JSON.parse(localStorage.getItem("user") || "null") as User | null;
  }

  public setUser(user: User) {
    const oldUser = this.getUser();
    localStorage.setItem("user", JSON.stringify({
      ...user,
      password: user.password || oldUser.password,
    }));
  }

  public clear() {
    localStorage.clear();
  }
}
