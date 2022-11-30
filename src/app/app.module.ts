import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { allIcons, HeroIconModule } from "ng-heroicon";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { AuthComponent } from './components/auth/auth.component';
import { AppRoutingModule } from "./app-routing.module";
import { AuthModule } from "./components/auth/auth.module";
import { HelloworldComponent } from './components/helloworld/helloworld.component';
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [AppComponent, AuthComponent, HelloworldComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    HeroIconModule.forRoot(
      {
        ...allIcons,
      },
      {
        defaultHostDisplay: "inlineBlock", // default 'none'
        attachDefaultDimensionsIfNoneFound: true, // default 'false'
      }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
