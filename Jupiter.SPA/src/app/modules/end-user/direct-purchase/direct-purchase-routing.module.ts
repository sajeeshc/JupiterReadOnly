import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectPurchaseComponent } from './direct-purchase.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { DesignerComponent } from '../../../shared/designer/designer.component'
import { ProductViewComponent } from '../../../shared/product-view/product-view.component';
import { CartComponent } from '../../../shared/cart/cart.component';
import { CheckoutComponent } from '../../../shared/checkout/checkout.component';

const routes: Routes = [{
  path: '', component: DirectPurchaseComponent, children: [
    { path: 'productlist', component: ProductListComponent, pathMatch: 'full' },
    { path: 'productdetail/:productId', component: ProductDetailComponent, pathMatch: 'full' },
    { path: 'designer/:productId', component: DesignerComponent, pathMatch: 'full' },
    { path: 'productview/:productId', component: ProductViewComponent, pathMatch: 'full' },
    { path: 'editproductview/:productId/:cartId', component: ProductViewComponent, pathMatch: 'full' },
    { path: 'productview', component: ProductViewComponent, pathMatch: 'full' },
    { path: 'cart', component: CartComponent, pathMatch: 'full' },
    { path: 'checkout', component: CheckoutComponent, pathMatch: 'full' },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectPurchaseRoutingModule { }
