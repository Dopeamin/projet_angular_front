import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html"
})
export class PostComponent implements OnInit {
  open: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  onSeeMoreClick() {
    this.open = !this.open;
  }
}
