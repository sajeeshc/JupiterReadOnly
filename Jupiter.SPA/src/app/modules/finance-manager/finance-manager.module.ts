import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { ArtAdminModule } from "../art-admin/art-admin.module";
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from "@angular/forms";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { ColorPickerModule } from 'ngx-color-picker';
import { FinanceManagerComponent } from "./finance-manager.component";
import { FinanceManagerRoutingModule } from "./finance-manager-routing.module";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { OrderPendingPaymentComponent } from './order-pending-payment/order-pending-payment.component';
import { CreditRequestListComponent } from './credit-request-list/credit-request-list.component';
import { FinancialReportComponent } from './financial-report/financial-report.component';
import { DiscountApplicationsComponent } from './discount-applications/discount-applications.component';
import {MatTabsModule} from '@angular/material/tabs';
import { StoreDiscountApplicationComponent } from './store-discount-application/store-discount-application.component';
import { CancelledItemsComponent } from './cancelled-items/cancelled-items.component';
import { ShippingMethodsComponent } from './settings/shipping-methods/shipping-methods.component';
import { SettingsComponent } from './settings/settings.component';
import { ShippingChargeUpdateRequestListComponent } from './shipping-charge-update-request-list/shipping-charge-update-request-list.component';

@NgModule({
  declarations: [
    FinanceManagerComponent,
    DashboardComponent,
    OrderPendingPaymentComponent,
    CreditRequestListComponent,
    FinancialReportComponent,
    DiscountApplicationsComponent,
    StoreDiscountApplicationComponent,
    CancelledItemsComponent,
    ShippingMethodsComponent,
    SettingsComponent,
    ShippingChargeUpdateRequestListComponent,
  ],
  imports: [
    SharedModule,
    FinanceManagerRoutingModule,
    ArtAdminModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ColorPickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatMomentDateModule,
    MatTabsModule,
  ],
  providers: [
  ],
  entryComponents: [],
})
export class FinanceManagerModule { }
