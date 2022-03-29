import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancelledItemsComponent } from './cancelled-items/cancelled-items.component';
import { CreditRequestListComponent } from './credit-request-list/credit-request-list.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DiscountApplicationsComponent } from './discount-applications/discount-applications.component';
import { FinanceManagerComponent } from './finance-manager.component';
import { FinancialReportComponent } from './financial-report/financial-report.component';
import { OrderPendingPaymentComponent } from './order-pending-payment/order-pending-payment.component';
import { SettingsComponent } from './settings/settings.component';
import { ShippingMethodsComponent } from './settings/shipping-methods/shipping-methods.component';
import { ShippingChargeUpdateRequestListComponent } from './shipping-charge-update-request-list/shipping-charge-update-request-list.component';
import { StoreDiscountApplicationComponent } from './store-discount-application/store-discount-application.component';

const routes: Routes = [
  {
    path: '', component: FinanceManagerComponent, children: [
      { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
      { path: 'orderpendingpayment', component: OrderPendingPaymentComponent, pathMatch: 'full' },
      { path: 'creditrequestlist', component: CreditRequestListComponent, pathMatch: 'full' },
      { path: 'financialreport', component: FinancialReportComponent, pathMatch: 'full' },
      { path: 'discountapplications', component: DiscountApplicationsComponent, pathMatch: 'full' },
      { path: 'discountapplications/store/:id', component: StoreDiscountApplicationComponent, pathMatch: 'full' },
      { path: 'cancelleditems', component: CancelledItemsComponent, pathMatch: 'full' },
      { path: 'shippingchargeupdaterequestlist', component: ShippingChargeUpdateRequestListComponent, pathMatch: 'full' },
      {
        path: 'settings', component: SettingsComponent, children: [
          { path: 'shippingmethods', component: ShippingMethodsComponent, pathMatch: 'full' },
        ]
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceManagerRoutingModule { }
