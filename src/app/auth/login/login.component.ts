import { AuthService } from "@/app/services/auth/auth.service";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  signinForm: FormGroup;
  errorMessage: string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.signinForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  formElement(element: string): FormControl {
    return this.signinForm.get(element) as FormControl;
  }

  onSubmit() {
    if (this.signinForm.invalid) return;
    this.authService
      .login(this.signinForm.value)
      .then(() => {
        this.router.navigate(["/messenger"]);
        this.showSuccess();
      })
      .catch((err) => {
        console.error(err);
        this.errorMessage = err.error.errorMessage;
        this.showError(this.errorMessage);
      });
  }

  showSuccess() {
    this.toastrService.success("Login successful!", "Welcome back");
  }

  showError(message: string) {
    this.toastrService.error("Login Failed!", message);
  }
}
