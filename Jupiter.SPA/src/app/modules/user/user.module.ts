import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent} from './user.component'
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [UserComponent,HomeComponent, LoginComponent, ProfileComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatCardModule
  ]
})
export class UserModule { }
