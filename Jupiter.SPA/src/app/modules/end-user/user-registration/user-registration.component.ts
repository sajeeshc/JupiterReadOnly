import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})

export class UserRegistrationComponent implements OnInit {
  loading: boolean;
  registrationForm: FormGroup;
  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  isRegistered: boolean = false;
  auth = ''
  key = ''
  gotocart = false

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.auth = this.route.snapshot.queryParams['auth'] || ''
    this.key = this.route.snapshot.queryParams['key'] || ''
    this.gotocart = this.route.snapshot.queryParams['gotocart'] || false
    if (this.auth && this.key) {
      this.getUser()
    }
    this.setUpCreateUserForm();
    
    
  }

  setUpCreateUserForm() {
    this.registrationForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern)]
      ),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      phoneNumber: new FormControl(''),
      firstName: new FormControl('',Validators.required),
      lastName: new FormControl(''),
      // gender: ['Male'],
      otp: new FormControl('')
    });
  }

  createUser() {
    if (this.registrationForm.valid) {
      if (this.registrationForm.value.password != this.registrationForm.value.confirmPassword) {
        this.commonService.openErrorSnackBar("Password do not match!", "");
        return;
      }
      let password: String = this.registrationForm.value.password;
      if (password.length < 5) {
        this.commonService.openErrorSnackBar("Password at least 5 characters!", "");
        return;
      }
      this.userService.createUser(this.registrationForm.value).subscribe(
        (response) => {
          this.commonService.openSuccessSnackBar(response.message, "");
          this.isRegistered = true;
        },
        (error) => {
          this.commonService.openErrorSnackBar(error, "");
        }
      );
    }

  }

  resendOtp() {
    if (this.registrationForm.value.password != this.registrationForm.value.confirmPassword) {
      this.commonService.openErrorSnackBar("Password do not match!", "");
      return;
    }
    let password: String = this.registrationForm.value.password;
    if (password.length < 5) {
      this.commonService.openErrorSnackBar("Password at least 5 characters!", "");
      return;
    }
    this.userService.resendOtp(this.registrationForm.value.email).subscribe(
      (response) => {
        this.commonService.openSuccessSnackBar("OTP has been resend to the email", "");
      },
      (error) => {
        this.commonService.openErrorSnackBar(error, "");
      }
    );
  }

  verifyUser() {
    this.userService.verifyUser(this.registrationForm.value).subscribe(
      (response) => {
        this.commonService.openSuccessSnackBar(response.message, "");
        this.autoLogin(this.registrationForm.value.email,this.registrationForm.value.password)
        // this.router.navigateByUrl('enduser/login');
      },
      (error) => {
        this.commonService.openErrorSnackBar(error, "");
      }
    );
  }

  login() {
    this.router.navigateByUrl('enduser/login');
  }

  autoLogin(email,password) {
    
    let role: any;
    let isAuthorized = false;
      this.authenticationService.login({email,password}).subscribe(
        data => {
          role = data.user.roles[0];
          isAuthorized = role.name === "ENDUSER";
          if (isAuthorized) {
            window.parent.postMessage(data, "*");
          } else {
            this.commonService.openErrorSnackBar("Authorization failed", "");
            this.loading = false;
          }
        },
        error => {
          this.commonService.openErrorSnackBar(error, "");
          this.loading = false;
        });
  }


getUser() {
  this.authenticationService.getUserByAuthKey(this.auth, this.key).subscribe(res => {
    if (res.data.emailConfirmed === false) {
      this.registrationForm = this.formBuilder.group({
        email: new FormControl(res.data.email, [
          Validators.required,
          Validators.pattern(this.emailPattern)]
        ),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
        phoneNumber: res.data.phoneNumber,
        firstName: new FormControl(res.data.firstName,Validators.required),
        lastName: res.data.lastName,
        // gender: ['Male'],
        otp: new FormControl('')
      });

      console.log(this.registrationForm.value)
    }
  })
  // if(this.userObj){

  // }
}
}
