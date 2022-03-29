import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { ArtAdminModule } from "../art-admin/art-admin.module";
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { TeamStoreManagerRoutingModule } from "./team-store-manager-routing.module";
import { TeamStoreManagerComponent } from "./team-store-manager.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CreateStoreRequestComponent } from "./create-store-request/create-store-request.component";

import { ReactiveFormsModule } from "@angular/forms";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { ProductSelectionComponent } from "./product-selection/product-selection.component";
import { ColorPickerModule } from 'ngx-color-picker';
import { StorerequestComponent } from './store-request/store-request.component';
import { StoreSpecificationComponent } from './store-specification/store-specification.component';
import { StoreRequestListComponent } from './store-request-list/store-request-list.component';
import { OrderPendingPaymentComponent } from './order-pending-payment/order-pending-payment.component';
import { ViewArtComponent } from './view-art/view-art.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { BulkOrderEntryComponent } from './bulk-order-entry/bulk-order-entry.component';
import { BulkOrderEntryListComponent } from './bulk-order-entry-list/bulk-order-entry-list.component';
import { OrderOutputComponent } from './order-output/order-output.component';
import {MatTabsModule} from '@angular/material/tabs';
import { AllStoreListComponent } from './all-store-list/all-store-list.component';
import { StoreOrderStatusComponent } from './store-order-status/store-order-status.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { PendingStoreRequestComponent } from './pending-store-request/pending-store-request.component';
@NgModule({
  declarations: [
    TeamStoreManagerComponent,
    DashboardComponent,
    CreateStoreRequestComponent,
    ProductSelectionComponent,
    StorerequestComponent,
    StoreSpecificationComponent,
    StoreRequestListComponent,
    OrderPendingPaymentComponent,
    ViewArtComponent,
    OrderListComponent,
    OrderDetailsComponent,
    BulkOrderEntryComponent,
    BulkOrderEntryListComponent,
    OrderOutputComponent,
    AllStoreListComponent,
    StoreOrderStatusComponent,
    PendingStoreRequestComponent
  ],
  imports: [
    SharedModule,
    TeamStoreManagerRoutingModule,
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
    MatExpansionModule,
  ],
  providers: [
  ],
  entryComponents: [ProductSelectionComponent],
})
export class TeamStoreManagerModule { }
