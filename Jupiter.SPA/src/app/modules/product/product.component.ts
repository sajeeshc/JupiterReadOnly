import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewChecked {

  userObj: any = {};
  header : string;
  showBackButton = true
  loading = false

  constructor(
    private authService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService : CommonService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.commonService.loading$.subscribe((res) => {
      this.loading = res;
    });
    this.header = 'PRODUCT/PURCHASE MANAGER DASHBOARD';
    localStorage.setItem('pageHeader',this.header)
    this.commonService.data$.subscribe(res => this.header = res)
    this.commonService.showBackButton$.subscribe(res=> this.showBackButton = res)
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
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

  goBack(){
    window.history.go(-1);
  }

}
