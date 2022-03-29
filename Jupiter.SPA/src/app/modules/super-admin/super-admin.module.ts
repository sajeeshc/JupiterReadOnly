import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SuperAdminComponent } from './super-admin.component';
import { UserListComponent } from './user-list/user-list.component';
import { AddUserComponent } from './add-user/add-user.component';


@NgModule({
  declarations: [
    SuperAdminComponent,
    DashboardComponent,
    UserListComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    SharedModule
  ]
})
export class SuperAdminModule { }
