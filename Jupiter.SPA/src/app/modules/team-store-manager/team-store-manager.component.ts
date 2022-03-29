import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AlertService } from "src/app/core/services/alert.service";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { CommonService } from "src/app/core/services/common.service";
import Swal from "sweetalert2";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-team-store-manager",
  templateUrl: "./team-store-manager.component.html",
  styleUrls: ["./team-store-manager.component.scss"],
})
export class TeamStoreManagerComponent implements OnInit {
  userObj: any = {};
  header: String;
  showBackButton = true
  isChangesSaved = false;
  loading = false
  constructor(
    private authService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,    
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.commonService.changesSaved$.subscribe((res) => {
      this.isChangesSaved = res;
    });
    this.commonService.loading$.subscribe((res) => {
      this.loading = res;
    });
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
  // goBack(){
  //   window.history.go(-1);
  // }

  goBack(value?) {
    let shouldContinue = value ? value : this.checkIsChangesSaved(this.goBack);
    if (shouldContinue) {
      window.history.go(-1);
    }
  }

  goToHome(value?) {
    let shouldContinue = value ? value : this.checkIsChangesSaved(this.goToHome);
    if (shouldContinue) {
      this.router.navigate(["/storemanager/dashboard"]);
    }
  }
  checkIsChangesSaved(fun?) {
    if (!this.isChangesSaved) {
      Swal.fire({
        title: "Unsaved changes will be lost !",
        text: "Do you want to continue",
        showCancelButton: true,
        icon: "warning",
      }).then((result) => {
        if (result.isConfirmed) {
          this.commonService.setChangesSavedValue(true);
          if (fun) fun.bind(this)(true);
        }
      });
      return false;
    } else {
      return true;
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  goToReport(value?){
    let shouldContinue = value ? value : this.checkIsChangesSaved(this.goToReport);
    if (shouldContinue) {
      this.router.navigate(["/storemanager/report"]);
    }
  }
}
