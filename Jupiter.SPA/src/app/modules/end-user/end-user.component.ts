import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-end-user',
  templateUrl: './end-user.component.html',
  styleUrls: ['./end-user.component.scss']
})
export class EndUserComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {
    window.addEventListener("message", (event) => {
      if (event.origin !== environment.wpUrl.substr(0,environment.wpUrl.length-1))
        return;

      if (event.data === 'logout'){
        this.authService.logout({ token: localStorage.getItem('token'), refreshToken: localStorage.getItem('refreshToken') })
          .subscribe(res => {
            this.router.navigateByUrl('/enduser/login')
          })
      } else if(event.data.message && event.data.message == 'user found'){
        
      }
    }, false);
  }

}
