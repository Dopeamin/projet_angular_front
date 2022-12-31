import { Component, OnInit, Input, forwardRef } from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
} from "@angular/forms";

@Component({
  selector: "app-standard-input",
  templateUrl: "./standard-input.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StandardInputComponent),
      multi: true,
    },
  ],
})
export class StandardInputComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = "";
  @Input() type: string = "";
  @Input() formElement: FormControl;
  public value: string;
  public changed: (value: string) => void;
  public touched: () => void;
  public disabled: boolean = false;

  constructor() { }
  ngOnInit(): void { }
  public writeValue(value: string) {
    if (value !== undefined) {
      this.value = value;
    }
  }
  public propagateChange = (_: any) => { };

  public registerOnChange(fn) {
    this.changed = fn;
  }
  public onChange(event: Event): void {
    const value: string = (<HTMLInputElement>event.target).value;
    this.changed(value);
  }
  public registerOnTouched(fn) {
    this.touched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

}
