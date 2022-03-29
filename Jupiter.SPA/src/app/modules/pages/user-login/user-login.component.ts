import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '../../../core/services/alert.service';
import { AuthenticationService } from '../../../core/services/authentication.service';


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
  model: any = {};
  public emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {

  }

  ngOnInit () {

    this.loginForm = this.formBuilder.group({
      email: new FormControl('',
        Validators.required
      ),
      password: new FormControl('', Validators.required)
    });

  }


  login () {
    var role: any;
    let isAuthorized= false;
    if (this.loginForm.valid) {
      this.loading = true;
      this.authenticationService.login(this.loginForm.value).subscribe(
        data => {
          role = data.user.roles[0];
          isAuthorized = role.name==="ENDUSER";
          if(isAuthorized) {
            window.parent.postMessage(data, "*");
            //this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    }
  }

}
