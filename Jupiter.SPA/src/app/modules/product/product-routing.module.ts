import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { BulkSizeChartComponent } from './bulk-size-chart/bulk-size-chart.component';
import { CreatePromotionComponent } from './create-promotion/create-promotion.component';
import { ProductDashoardComponent } from './product-dashoard/product-dashoard.component';
import { ProductDataComponent } from './product-data/product-data.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { BoxComponent } from './product-settings/box/box.component';
import { DecoGroupComponent } from './product-settings/deco-group/deco-group.component';
import { UpdateDecoGroupComponent } from './product-settings/deco-group/update-deco-group/update-deco-group.component';
import { DecoPositionsComponent } from './product-settings/deco-positions/deco-positions.component';
import { ItemTypeComponent } from './product-settings/item-type/item-type.component';
import { MarginCalcComponent } from './product-settings/margin-calc/margin-calc.component';
import { ProductCategoryComponent } from './product-settings/product-category/product-category.component';
import { ProductGroupComponent } from './product-settings/product-group/product-group.component';
import { ProductSettingsComponent } from './product-settings/product-settings.component';
import { ServicesComponent } from './product-settings/services/services.component';
import { StoreStatusComponent } from './product-settings/store-status/store-status.component';
import { ProductComponent } from './product.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { SetCategoryComponent } from './set-category/set-category.component';
import { SetDecoGroupComponent } from './set-deco-group/set-deco-group.component';


const routes: Routes = [
  {
    path: '', component: ProductComponent, children: [
      { path: 'dashboard', component: ProductDashoardComponent, pathMatch: 'full' },
      { path: 'productdata/:productId', component: AddProductComponent, pathMatch: 'full' },
      { path: 'productmanagement', component: ProductManagementComponent, pathMatch: 'full' },
      { path: 'productlist', component: ProductListComponent, pathMatch: 'full' },
      {
        path: 'settings', component: ProductSettingsComponent, children: [
          { path: 'productcategory', component: ProductCategoryComponent },
          { path: 'productgroup', component: ProductGroupComponent },
          { path: 'margincalculation', component: MarginCalcComponent },
          { path: 'decopositions', component: DecoPositionsComponent },
          { path: 'services', component: ServicesComponent },
          { path: 'storestatus', component: StoreStatusComponent },
          { path: 'decogroup', component: DecoGroupComponent, pathMatch: 'full' },
          { path: 'decogroup/:decoGroupId', component: UpdateDecoGroupComponent, pathMatch: 'full' },
          { path: 'itemtype', component: ItemTypeComponent, pathMatch: 'full' },
          { path: 'box', component: BoxComponent, pathMatch: 'full' },
        ]
      },
      { path: 'promotion', component: CreatePromotionComponent, pathMatch: 'full' },
      { path: 'promotionlist', component: PromotionListComponent, pathMatch: 'full' },
      { path: 'addproduct', component: AddProductComponent, pathMatch: 'full' },
      { path: 'updateproductcategory', component: SetCategoryComponent, pathMatch: 'full' },
      { path: 'updateproductdecogroup', component: SetDecoGroupComponent, pathMatch: 'full' },
      { path: 'bulksizechart', component: BulkSizeChartComponent, pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
