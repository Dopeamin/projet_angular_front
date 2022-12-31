import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }
  async canActivate(): Promise<boolean> {
    const user = await this.authService.whoami();
    if (!user) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
