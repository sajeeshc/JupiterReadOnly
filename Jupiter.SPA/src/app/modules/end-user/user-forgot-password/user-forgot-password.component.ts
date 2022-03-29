import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-forgot-password',
  templateUrl: './user-forgot-password.component.html',
  styleUrls: ['./user-forgot-password.component.scss']
})
export class UserForgotPasswordComponent implements OnInit {

  loading: boolean;
  forgotPasswordForm: FormGroup;
  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  otpSend: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit() {
    this.otpSend = false;
    this.SetUpForm();
  }

  SetUpForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern)]
      ),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
      // gender: ['Male'],
      otp: new FormControl('', [Validators.required])
    });
    // this.forgotPasswordForm.controls['password'].disable();
    // this.forgotPasswordForm.controls['confirmPassword'].disable();
  }

  forgotPassword() {
    if (this.forgotPasswordForm.get("email").valid) {
      var obj = {
        email: this.forgotPasswordForm.value.email
      };
      this.userService.forgotPassword(obj).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.commonService.openSuccessSnackBar(res.message, "");
            this.otpSend = true;
          } else {
            this.commonService.openErrorSnackBar(res.message, "");
          }
        },
        (error) => {
          this.commonService.openErrorSnackBar(error, "");
        }
      );
    }else{
      this.commonService.openWarningSnackBar("Please enter a valid email", "");
    }

  }

  verifyOtp() {
    if (this.forgotPasswordForm.valid) {
      if (this.forgotPasswordForm.value.password.trim() && this.forgotPasswordForm.value.confirmPassword.trim()) {
        if (this.forgotPasswordForm.value.password.trim() != this.forgotPasswordForm.value.confirmPassword.trim()) {
          this.commonService.openErrorSnackBar("Password do not match!", "");
          return;
        } else if (this.forgotPasswordForm.value.otp.toString().length != 6) {
          this.commonService.openErrorSnackBar("OTP must be 6 digits!", "");
          return;
        }
      } else {
        this.commonService.openErrorSnackBar("Please enter the password!", "");
        return;
      }
    } else {
      if (this.forgotPasswordForm.value.password.trim().length < 5) {
        this.commonService.openErrorSnackBar("Password should be at least 5 characters!", "");
        return;
      } else if (this.forgotPasswordForm.value.confirmPassword.trim().length < 5) {
        this.commonService.openErrorSnackBar("Password should be at least 5 characters!", "");
        return;
      } else if (!this.forgotPasswordForm.value.otp.toString().trim()) {
        this.commonService.openErrorSnackBar("Please enter a valid OTP!", "");
        return;
      } else {
        this.commonService.openErrorSnackBar("Please fill all fields with valid data!", "");
        return;
      }
    }


    var obj = { ...this.forgotPasswordForm.value };
    delete obj["confirmPassword"]

    this.userService.verifyUser(obj).subscribe(
      (success) => {
        this.commonService.openSuccessSnackBar("Password updated successfully!", "");
        this.router.navigateByUrl('enduser/login');
      },
      (error) => {
        this.commonService.openErrorSnackBar(error, "");
      }
    );
  }

  resendOtp() {
    this.userService.resendOtp(this.forgotPasswordForm.value.email).subscribe(
      (success) => {
        this.commonService.openSuccessSnackBar(success.message, "");
      },
      (error) => {
        this.commonService.openErrorSnackBar(error, "");
      }
    );
  }


  login() {
    this.router.navigateByUrl('enduser/login');
  }
}

