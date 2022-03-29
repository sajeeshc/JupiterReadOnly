import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamStoreManagerComponent } from './team-store-manager.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StoreListComponent } from '../../shared/store-list/store-list.component';
import { StoreRequestListComponent } from './store-request-list/store-request-list.component';
import { StoreSpecificationComponent } from './store-specification/store-specification.component';
import { StorerequestComponent } from './store-request/store-request.component';
import { OrderPendingPaymentComponent } from './order-pending-payment/order-pending-payment.component';
import { ArtPendingApprovalComponent } from '../art-admin/art-pending-approval/art-pending-approval.component';
import { ViewArtComponent } from './view-art/view-art.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderListComponent } from './order-list/order-list.component';
import { BulkOrderEntryComponent } from './bulk-order-entry/bulk-order-entry.component'
import { DesignerComponent } from 'src/app/shared/designer/designer.component';
import { BulkOrderEntryListComponent } from './bulk-order-entry-list/bulk-order-entry-list.component';
import { OrderOutputComponent } from './order-output/order-output.component';
import { AllStoreListComponent } from './all-store-list/all-store-list.component';
import { StoreOrderStatusComponent } from './store-order-status/store-order-status.component';
import { PendingStoreRequestComponent } from './pending-store-request/pending-store-request.component';

const routes: Routes = [
  {
    path: '', component: TeamStoreManagerComponent, children: [
      { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
      { path: 'storelist/:stage', component: StoreListComponent, pathMatch: 'full' },
      { path: 'storerequest', component: StorerequestComponent, pathMatch: 'full' },
      { path: 'storerequestlist', component: StoreRequestListComponent, pathMatch: 'full' },
      { path: 'newstorerequest/:type', component: PendingStoreRequestComponent, pathMatch: 'full' },
      { path: 'storerequest/:teamStoreId/:type', component: StorerequestComponent, pathMatch: 'full' },
      { path: 'copylayout/:teamStoreId/:type/:isTemplate', component: StorerequestComponent, pathMatch: 'full' },
      { path: 'updateStoreRequest/:type', component: StoreSpecificationComponent, pathMatch: 'full' },
      { path: 'verifystore/:teamStoreId/:type', component: StorerequestComponent, pathMatch: 'full' },
      { path: 'storespecification/:type', component: StoreSpecificationComponent, pathMatch: 'full' },
      { path: 'verifystorespecification/:type', component: StoreSpecificationComponent, pathMatch: 'full' },
      { path: 'orderpendingpayment', component: OrderPendingPaymentComponent, pathMatch: 'full' },
      { path: 'artpendingapproval', component: ArtPendingApprovalComponent, pathMatch: 'full' },
      { path: 'viewartlist', component: ViewArtComponent, pathMatch: 'full' },
      { path: 'orderlist', component: OrderListComponent, pathMatch: 'full' },
      { path: 'orderdetails/:orderId', component: OrderDetailsComponent, pathMatch: 'full' },
      { path: 'bulkorderentry', component: BulkOrderEntryComponent, pathMatch: 'full' },
      { path: 'bulkorderentry/designer/:productId', component: DesignerComponent, pathMatch: 'full' },
      { path: 'bulkorderentrylist', component: BulkOrderEntryListComponent, pathMatch: 'full' },
      { path: 'orderoutput', component: OrderOutputComponent, pathMatch: 'full' },
      { path: 'allstores/:stage', component: AllStoreListComponent, pathMatch: 'full' },
      { path: 'storeorderstatus/:storeId', component: StoreOrderStatusComponent, pathMatch: 'full' },
      { path: 'report', loadChildren: () => import('../report/report.module').then(m => m.ReportModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamStoreManagerRoutingModule { }
