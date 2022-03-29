import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {

  constructor(
    private userService:UserService
  ) { }

  userName: string

  ngOnInit() {
    this.userName = JSON.parse(localStorage.getItem("user")).name
  }
  
}
