import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { first, map, startWith } from "rxjs/operators";

import { AlertService } from "../../../core/services/alert.service";
import { AuthenticationService } from "../../../core/services/authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  errorText: String;
  showResponseMessage: boolean;
  model: any = {};
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(this.emailPattern)
      ]),
      password: new FormControl("", Validators.required),
    });
    // this.loginForm.valueChanges.pipe(     
    //   startWith(''),
    //   map((value) => {value.email = value.email.trim();
    //   return value;})
    // );  
  }


  login() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authenticationService.login(this.loginForm.value).subscribe(
        (response) => {
          this.showResponseMessage = true;
          if (response.token) {
            this.showResponseMessage = false;
            switch(response.user.roles[0].id){
              case 1 : this.router.navigate(["/superadmin/dashboard"]);
              break;
              case 3 : this.router.navigate(["/storebuilder/dashboard"]);
              break;
              case 7 : this.router.navigate(["/storemanager/dashboard"]);
              break;
              case 5 : this.router.navigate(["/artprocess/dashboard"]);
              break;
              case 4 : this.router.navigate(["/artadmin/dashboard"]);
              break;
              case 8 : this.router.navigate(["/artdirector/orderArtList"]);
              break;
              case 9 : this.router.navigate(["/financemanager/dashboard"]);
              break;
              case 10 : this.router.navigate(["/productmanager/dashboard"]);
              break;
            }
          } else {
            this.errorText = response.message;
            this.showResponseMessage = true;
          }
          this.loading = false;
        },
        (error) => {

          this.errorText = error;
          this.showResponseMessage = true;
          this.loading = false;
        }
      );
    }
  }
}
