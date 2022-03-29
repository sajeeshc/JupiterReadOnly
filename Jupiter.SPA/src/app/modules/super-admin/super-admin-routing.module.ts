import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SuperAdminComponent } from './super-admin.component';
import { UserListComponent } from './user-list/user-list.component';


const routes: Routes = [
  {
    path: '', component: SuperAdminComponent, children: [
      { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
      { path: 'userlist', component: UserListComponent, pathMatch: 'full' },
      { path: 'adduser', component: AddUserComponent, pathMatch: 'full' },
      { path: 'edituser/:userId', component: AddUserComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
