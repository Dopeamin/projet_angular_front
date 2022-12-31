import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FilterButtonComponent } from "./filter-button/filter-button.component";
import { HeroIconModule, allIcons } from "ng-heroicon";
import { ButtonComponent } from "./button/button.component";
import { StandardInputComponent } from "./standard-input/standard-input.component";
import { FormsModule } from "@angular/forms";
import { InitialsPipe } from "./pipes/initials.pipe";
import { ElapsedTimePipe } from "./pipes/elapsed-time.pipe";
import { ModalComponent } from "./modal/modal.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostComponent } from './post/post.component';
import { HeaderComponent } from "./header/header.component";
import { DropdownComponent } from "./header/dropdown/dropdown.component";
import { NotificationsComponent } from './header/notifications/notifications.component';
import { SafeResourceUrlPipe } from './pipes/safe-resource-url.pipe';
import { RouterModule } from "@angular/router";
import { SearchComponent } from './header/search/search.component';
import { InfiniteScrollDirective } from './directives/infinite-scroll.directive';

@NgModule({
  declarations: [
    FilterButtonComponent,
    ButtonComponent,
    StandardInputComponent,
    InitialsPipe,
    ElapsedTimePipe,
    ModalComponent,
    PostComponent,
    HeaderComponent,
    DropdownComponent,
    NotificationsComponent,
    SafeResourceUrlPipe,
    SearchComponent,
    InfiniteScrollDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatProgressSpinnerModule,
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
  exports: [
    FilterButtonComponent,
    ButtonComponent,
    ModalComponent,
    HeroIconModule,
    StandardInputComponent,
    InitialsPipe,
    ElapsedTimePipe,
    MatProgressSpinnerModule,
    PostComponent,
    HeaderComponent,
    SafeResourceUrlPipe,
    InfiniteScrollDirective,
  ],
})
export class SharedModule { }
