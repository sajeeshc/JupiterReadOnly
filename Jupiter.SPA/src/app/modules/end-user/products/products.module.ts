import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { SharedModule } from '../../../shared/shared.module';
import { FeaturedComponent } from './featured/featured.component';
import { ProductsRoutes } from './products-routing.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ProductsRoutes
  ],
  declarations: [ProductsComponent, FeaturedComponent]
})
export class ProductsModule { }
