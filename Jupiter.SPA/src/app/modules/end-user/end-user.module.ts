import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatCheckboxModule, MatFormFieldModule } from "@angular/material";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from "@angular/forms";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { ColorPickerModule } from 'ngx-color-picker';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { EndUserRoutingModule } from './end-user-routing.module';
import { EndUserComponent } from './end-user.component';
import { RequestFreeStoreComponent } from './request-free-store/request-free-store.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { TeamStoreComponent } from './team-store/team-store.component';
import { UserForgotPasswordComponent } from './user-forgot-password/user-forgot-password.component';


@NgModule({
  declarations: [
    EndUserComponent,
    RequestFreeStoreComponent,
    UserLoginComponent,
    UserRegistrationComponent,
    TeamStoreComponent,
    UserForgotPasswordComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    EndUserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatGridListModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatAutocompleteModule,
    MatCheckboxModule,
    ColorPickerModule,
    MatDividerModule,
    MatListModule
  ]
})
export class EndUserModule { }
