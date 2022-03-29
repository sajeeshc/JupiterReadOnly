import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "src/app/core/services/alert.service";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { CommonService } from "src/app/core/services/common.service";

@Component({
  selector: 'app-finance-manager',
  templateUrl: './finance-manager.component.html',
  styleUrls: ['./finance-manager.component.scss']
})
export class FinanceManagerComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) { }
  userObj: any = {};
  header: String;
  showBackButton = true
  ngOnInit() {
    this.commonService.data$.subscribe(res => this.header = res)
    this.commonService.showBackButton$.subscribe(res => this.showBackButton = res)
  }
  onActivate() {
    window.scroll(0, 0);
  }

  logout() {
    this.userObj = {
      Token: localStorage.getItem("token"),
      RefreshToken: localStorage.getItem("refreshToken"),
    };
    this.authService.logout(this.userObj).subscribe(
      (response) => {
        if (response == true) {
          this.router.navigate(["/login"]);
        } else {
          //this.alertService.error("Logout failed");
        }
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }
  goBack() {
    window.history.go(-1);
  }
}
