import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EndUserComponent } from './end-user.component';

import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { RequestFreeStoreComponent } from './request-free-store/request-free-store.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { TeamStoreComponent } from './team-store/team-store.component';
import { UserForgotPasswordComponent } from './user-forgot-password/user-forgot-password.component';
import { CartComponent } from 'src/app/shared/cart/cart.component';

const routes: Routes = [
  {
    path: '', component: EndUserComponent, children: [
      { path: 'signup', component: UserRegistrationComponent, pathMatch: 'full' },
      { path: 'forgot', component: UserForgotPasswordComponent, pathMatch: 'full' },
      { path: 'login', component: UserLoginComponent, pathMatch: 'full' },
      { path: 'cart', component: CartComponent, pathMatch: 'full' },
      { path: 'requestfreestore', component: RequestFreeStoreComponent, pathMatch: 'full' },
      { path: 'teamstore', component: TeamStoreComponent, pathMatch: 'full' },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'buyfromlivestore',
        loadChildren: () => import('./buy-from-live-store/buy-from-live-store.module').then(m => m.BuyFromLiveStoreModule)
      },
      {
        path: 'buildownstore',
        loadChildren: () => import('./build-own-store/build-own-store.module').then(m => m.BuildOwnStoreModule)
      },
      {
        path: 'suggestedtemplate',
        loadChildren: () => import('./suggested-template/suggested-template.module').then(m => m.SuggestedTemplateModule)
      },
      {
        path: 'useraccount',
        loadChildren: () => import('./user-account/user-account.module').then(m => m.UserAccountModule)
      },
      {
        path: 'directpurchase',
        loadChildren: () => import('./direct-purchase/direct-purchase.module').then(m => m.DirectPurchaseModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EndUserRoutingModule { }
