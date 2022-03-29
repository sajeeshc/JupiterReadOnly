import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss']
})
export class VerifyUserComponent implements OnInit {
  userVerificationForm: FormGroup;
  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  urlParams = new URLSearchParams(window.location.search);
  userId: any;
  securityToken = this.urlParams.get('securityToken');
  handler = this.urlParams.get('handler');

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) { }

  ngOnInit () {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');
    });
    this.getUserDetails();
  }

  setUserVerificationForm (data) {
    this.userVerificationForm = this.formBuilder.group({
      email: data.email,
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    });
  }

  getUserDetails () {
    
    this.userService.getProfileDetails(this.userId, this.securityToken).subscribe(response => {
      if (response.data != null) {
        this.setUserVerificationForm(response.data);
      }
    },
      error => {
      });
  }

  verifyUserAccount () {
    if (this.userVerificationForm.valid) {
      if (this.userVerificationForm.value.password != this.userVerificationForm.value.confirmPassword) {
        this.commonService.openErrorSnackBar("Password do not match!", "");
        return;
      } else {

        var model = {
          id: this.userId,
          securityToken: this.securityToken,
          handler: this.handler,
          password: this.userVerificationForm.get('password').value
        }
        this.userService.verifyUserAccount(this.userId, model).subscribe(
          (response) => {
            this.commonService.openSuccessSnackBar(response.message, "");
            this.router.navigateByUrl('login');
          },
          (error) => {
            this.commonService.openErrorSnackBar(error, "");
          }
        );
      }
    }
  }
}
