import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component'

const routes: Routes = [
  {
    path: '', component: UserComponent, children: [
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent, pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
