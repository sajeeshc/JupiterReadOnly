import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderReportComponent } from './order-report/order-report.component';
import { SlowMovingProductsComponent } from './slow-moving-products/slow-moving-products.component';

import { StoreListComponent } from './store-list/store-list.component'
import { StoreOrderReportComponent } from './store-order-report/store-order-report.component';
import { StoreProductListComponent } from './store-product-list/store-product-list.component';
import { StoreProductReportComponent } from './store-product-report/store-product-report.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'store-product-report/:storeId/:mapCode', component: StoreProductReportComponent, pathMatch: 'full' },
  { path: 'store-order-report/:storeId', component: StoreOrderReportComponent, pathMatch: 'full' },
  { path: 'order-report/:orderId', component: OrderReportComponent, pathMatch: 'full' },
  { path: 'store-list/:reportName', component: StoreListComponent, pathMatch: 'full' },
  { path: 'store-product-list/:storeId/:reportName', component: StoreProductListComponent, pathMatch: 'full' },
  { path: 'slow-moving-products/:storeId', component: SlowMovingProductsComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
