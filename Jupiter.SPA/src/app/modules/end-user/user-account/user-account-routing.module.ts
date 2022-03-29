import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAccountComponent } from './user-account.component';
import { ProfileComponent } from './profile/profile.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { MyArtComponent } from './my-art/my-art.component';
import { MyStoreComponent } from './my-store/my-store.component';
import { MyOrganizationComponent } from './my-organization/my-organization.component';
import { CreditDetailsComponent } from './credit-details/credit-details.component';

const routes: Routes = [
  {
    path: '', component: UserAccountComponent, children: [
      { path: 'profile', component: ProfileComponent, pathMatch: 'full' },
      { path: 'orderhistory', component: OrderHistoryComponent, pathMatch: 'full' },
      { path: 'orderstatus', component: OrderStatusComponent, pathMatch: 'full' },
      { path: 'mystore', component: MyStoreComponent, pathMatch: 'full' },
      { path: 'myart', component: MyArtComponent, pathMatch: 'full' },
      { path: 'myorganizations', component: MyOrganizationComponent, pathMatch: 'full' },   
      { path: 'creditdetails', component: CreditDetailsComponent, pathMatch: 'full' },   
      { path: 'report', loadChildren:()=>import('../../report/report.module').then(m=>m.ReportModule) },   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAccountRoutingModule { }
