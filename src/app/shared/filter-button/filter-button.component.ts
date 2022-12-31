import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'filter-button',
  templateUrl: './filter-button.component.html',
})
export class FilterButtonComponent implements OnInit {
  @Input()
  title: string = 'Filter';

  @Input()
  toggled: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
