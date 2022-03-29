import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyFromLiveStoreComponent } from './buy-from-live-store.component';
import { StoreComponent } from './store/store.component';
import { StoreselectionComponent } from './storeselection/storeselection.component';
import { CartComponent } from '../../../shared/cart/cart.component';
import { CheckoutComponent } from '../../../shared/checkout/checkout.component';
import { ProductViewComponent } from '../../../shared/product-view/product-view.component';
import { FindMyStoreComponent } from './find-my-store/find-my-store.component';



const routes: Routes = [
  {
    path: '', component: BuyFromLiveStoreComponent, children: [
      { path: 'storeselection', component: StoreselectionComponent, pathMatch: 'full' },
      { path: 'find-my-store', component: FindMyStoreComponent, pathMatch: 'full' },
      { path: 'store/:teamstoreId', component: StoreComponent, pathMatch: 'full' },
      { path: 'productview/:productId/:mapCode', component: ProductViewComponent, pathMatch: 'full' },
      { path: 'editproductview/:productId/:cartId/:mapCode', component: ProductViewComponent, pathMatch: 'full' },
      { path: 'cart', component: CartComponent, pathMatch: 'full' },
      { path: 'checkout', component: CheckoutComponent, pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyFromLiveStoreRoutingModule { }
