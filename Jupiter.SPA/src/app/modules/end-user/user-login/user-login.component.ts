import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../../core/services/authentication.service";
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  errorText: String;
  showResponseMessage: boolean;
  model: any = {};
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  auth = ''
  key = ''
  gotocart = false
  userObj = {}

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.auth = this.route.snapshot.queryParams['auth'] || ''
    this.key = this.route.snapshot.queryParams['key'] || ''
    this.gotocart = this.route.snapshot.queryParams['gotocart'] || false
    if(this.auth && this.key){
      this.getUser()
    }
    this.loginForm = this.formBuilder.group({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      password: new FormControl("", Validators.required),
    });
  }

  login() {
    let role: any;
    let isAuthorized = false;
    if (this.loginForm.valid) {
      this.loading = true;
      this.authenticationService.login(this.loginForm.value).subscribe(
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
  }

  signUp() {
    if(this.auth)
      this.router.navigateByUrl('enduser/signup',{queryParams:{auth:this.auth, key:this.key, gotocart:this.gotocart}});
    else
      this.router.navigateByUrl('enduser/signup');
  }

  forgotPassword() {
    this.router.navigateByUrl('enduser/forgot');
  }

  getUser() {
    this.authenticationService.getUserByAuthKey(this.auth, this.key).subscribe(res=>{
      if(res.data.emailConfirmed === false){
        localStorage.setItem('signupUser',JSON.stringify(res.data))
        // this.signUp()
      }
    })
    if(this.userObj){

    }
  }
}
