import { AuthService } from "@/app/services/auth/auth.service";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup(
      {
        firstName: new FormControl("", [Validators.required]),
        lastName: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        ]),
        confirmPassword: new FormControl(null, [Validators.required]),
      },
      {
        validators: this.mustMatch("password", "confirmPassword"),
      }
    );
  }
  onSubmit() {
    if (this.signupForm.invalid) return;
    this.authService
      .register(this.signupForm.value)
      .then((res) => {
        console.log(res);
        this.showSuccess();
        this.router.navigate(["/login"]);
      })
      .catch((err) => {
        console.log(err);
        this.errorMessage = err.error.errorMessage;
        this.showError(this.errorMessage);
      });
  }

  formElement(element: string): FormControl {
    return this.signupForm.get(element) as FormControl;
  }

  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const pwd = formGroup.controls[password];
      const confirmPwd = formGroup.controls[confirmPassword];
      if (pwd.errors && !confirmPwd.errors["MustMatch"]) return null;
      if (pwd.value !== confirmPwd.value) {
        confirmPwd.setErrors({ MustMatch: true });
      } else {
        confirmPwd.setErrors(null);
      }
    };
  }

  showSuccess() {
    this.toastrService.success("Registration successful!", "Welcome among us");
  }

  showError(message: string) {
    this.toastrService.error("Registration Failed!", message);
  }
}
