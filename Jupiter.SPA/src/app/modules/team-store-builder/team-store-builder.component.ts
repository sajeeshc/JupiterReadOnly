import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "src/app/core/services/alert.service";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { CommonService } from "src/app/core/services/common.service";
import Swal from "sweetalert2";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-team-store-builder",
  templateUrl: "./team-store-builder.component.html",
  styleUrls: ["./team-store-builder.component.scss"],
})
export class TeamStoreBuilderComponent implements OnInit, AfterViewChecked {
  userObj: any = {};
  header: String;
  showBackButton = true;
  loading = false;
  isChangesSaved = false;
  constructor(
    private authService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.commonService.changesSaved$.subscribe((res) => {
      this.isChangesSaved = res;
    });
    this.commonService.loading$.subscribe((res) => {
      this.loading = res;
    });
    this.commonService.showBackButton$.subscribe(
      (res) => (this.showBackButton = res)
    );
    this.commonService.data$.subscribe((res) => (this.header = res));
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

  goBack(value?) {
    let shouldContinue = value ? value : this.checkIsChangesSaved(this.goBack);
    if (shouldContinue) {
      window.history.go(-1);
    }
  }

  goToHome(value?) {
    let shouldContinue = value
      ? value
      : this.checkIsChangesSaved(this.goToHome);
    if (shouldContinue) {
      this.router.navigate(["/storebuilder/dashboard"]);
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
}
