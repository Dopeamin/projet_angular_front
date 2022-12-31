import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Profile } from '@/types/profile.type';
import { Router } from '@angular/router';

@Component({
  selector: 'search-dropdown',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  @Input()
  profiles: Profile[] = [];

  @Input()
  isOpen: boolean = false;

  @Output()
  toggle: EventEmitter<boolean> = new EventEmitter();

  @Input()
  loading = false;
  

  constructor(
    private readonly router: Router,
  ) {

  }

  ngOnInit(): void {
  }

  onClick() {
    this.toggle.emit(!this.isOpen);
  }

  onProfileClick(profile: Profile) {
    this.router.navigate([`/profile/${profile.id}`]);
  }

}
