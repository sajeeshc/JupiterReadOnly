import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from "@angular/material/table";

import { ReportRoutingModule } from './report-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StoreListComponent } from './store-list/store-list.component';
import { StoreProductReportComponent } from './store-product-report/store-product-report.component';
import { StoreProductListComponent } from './store-product-list/store-product-list.component';
import { StoreOrderReportComponent } from './store-order-report/store-order-report.component';
import { OrderReportComponent } from './order-report/order-report.component';
import { SlowMovingProductsComponent } from './slow-moving-products/slow-moving-products.component';


@NgModule({
  declarations: [
    DashboardComponent,
    StoreListComponent,
    StoreProductReportComponent,
    StoreProductListComponent,
    StoreOrderReportComponent,
    OrderReportComponent,
    SlowMovingProductsComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    MatTableModule,
  ]
})
export class ReportModule { }
