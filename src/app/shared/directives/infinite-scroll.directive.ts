import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[infiniteScroll]'
})
export class InfiniteScrollDirective {
  @Output() onReachedEnd = new EventEmitter();
  @Input() threshold = 100;
  @Input() throttle = 300;
  private timeout: NodeJS.Timeout;
  constructor() { }

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    const scrollHeight = event.target.scrollHeight;
    const scrollTop = Math.abs(event.target.scrollTop);
    const clientHeight = event.target.clientHeight;
    if (scrollHeight - scrollTop - clientHeight < this.threshold) {
      if (!this.timeout)
        this.timeout = setTimeout(() => {
          this.onReachedEnd.emit();
          this.timeout = null;
        }, this.throttle);
    }
  }
}
