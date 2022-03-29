import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent implements OnInit {

  header:string;
  userObj:any;

  constructor(private commonService : CommonService,
    private authService : AuthenticationService,
    private router : Router) { }

  ngOnInit() {
    this.commonService.data$.subscribe(res => this.header = res);
  }

  logout(){
    this.userObj={
      Token:localStorage.getItem('token'),
      RefreshToken:localStorage.getItem('refreshToken')
    };
    this.authService.logout(this.userObj).subscribe(
      (response)=>{
        if(response == true){
          this.router.navigateByUrl("login");
        }
        else{

        }
      },
      (error=>{

      })
    )
  }

}
