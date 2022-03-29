import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { DirectPurchaseRoutingModule } from './direct-purchase-routing.module';
import { DirectPurchaseComponent } from './direct-purchase.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
  declarations: [
    DirectPurchaseComponent,
    ProductListComponent,
    ProductDetailComponent
  ],
  imports: [
    SharedModule,
    DirectPurchaseRoutingModule,
  ]
})
export class DirectPurchaseModule { }
