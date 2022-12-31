import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { MessengerModule } from "./messenger/messenger.module";
import { SocketIoModule } from 'ngx-socket-io';
import { AppRoutingModule } from "./app-routing.module";
import { AuthModule } from "./auth/auth.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileModule } from "./profile/profile.module";
import { ToastrModule } from 'ngx-toastr';
import { AuthentificationInterceptorProvider } from "./services/http/authentication.interceptor";
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SocketIoModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    AuthModule,
    MessengerModule,
    BrowserAnimationsModule,
    ProfileModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      maxOpened: 3
    })
  ],
  providers: [AuthentificationInterceptorProvider],
  bootstrap: [AppComponent],
})
export class AppModule { }
