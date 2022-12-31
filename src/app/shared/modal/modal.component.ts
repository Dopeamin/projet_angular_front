import { Component, Input, OnInit, TemplateRef } from "@angular/core";
@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styles: [],
})
export class ModalComponent implements OnInit {
  @Input()
  template: TemplateRef<any> | null;
  @Input()
  onSubmit: () => Promise<any> | any;
  @Input()
  onClose?: () => Promise<any> | any;
  @Input()
  title: string = "Title";
  @Input()
  isDisabled = false;
  @Input()
  isVisible = false;
  @Input()
  showCancel = true;
  @Input()
  showSubmit = true;
  @Input()
  submitText = "Submit";
  @Input()
  fixedHeight = false;

  isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  async submit() {
    if (!this.isDisabled) {
      this.isLoading = true;
      try {
        await this.onSubmit?.();
        await this.close?.();
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async close() {
    try {
      await this.onClose?.();
    } catch (e) {
      console.error(e);
    } finally {
    }
  }
}
