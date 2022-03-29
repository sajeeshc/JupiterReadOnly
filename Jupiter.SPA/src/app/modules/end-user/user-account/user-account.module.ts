import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountRoutingModule } from './user-account-routing.module'
import { ProfileComponent } from './profile/profile.component';
import { UserAccountComponent } from './user-account.component';

// import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatCheckboxModule, MatFormFieldModule, MatPaginatorModule } from "@angular/material";



import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { ColorPickerModule } from 'ngx-color-picker';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { MyStoreComponent } from './my-store/my-store.component';
import { MyArtComponent } from './my-art/my-art.component';
import { MyOrganizationComponent } from './my-organization/my-organization.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreditDetailsComponent } from './credit-details/credit-details.component';

@NgModule({
  declarations: [
    ProfileComponent,
    UserAccountComponent,
    OrderHistoryComponent,
    OrderStatusComponent,
    MyStoreComponent,
    MyArtComponent,
    MyOrganizationComponent,
    CreditDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserAccountRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatRadioModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatDatepickerModule,
    MatTabsModule,
    MatPaginatorModule,
    MatExpansionModule
  ]
})
export class UserAccountModule { }
