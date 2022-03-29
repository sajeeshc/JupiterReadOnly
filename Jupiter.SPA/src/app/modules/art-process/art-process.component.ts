import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-art-process',
  templateUrl: './art-process.component.html',
  styleUrls: ['./art-process.component.scss']
})
export class ArtProcessComponent implements OnInit {

  userObj: any = {};
  header : String;

  constructor(
    private authService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService : CommonService
  ) {}

  ngOnInit() {
    this.commonService.data$.subscribe(res => this.header = res)
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

}
