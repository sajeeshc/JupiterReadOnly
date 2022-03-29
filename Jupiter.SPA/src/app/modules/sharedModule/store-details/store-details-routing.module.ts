import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreDetailsComponent } from '../../../shared/store-details/store-details.component'
import { ProductListingComponent } from '../../../shared/store-details/product-listing/product-listing.component';
import { ActiveArtComponent } from '../../../shared/store-details/active-art/active-art.component';
import { ReviewProductsComponent } from '../../../shared/store-details/review-products/review-products.component';
import { CouponsDiscountsComponent } from '../../../shared/store-details/coupons-discounts/coupons-discounts.component';
import { StoreStyleEditorComponent } from '../../../shared/store-details/store-style-editor/store-style-editor.component';
import { StoreLayoutComponent } from '../../../shared/store-details/store-layout/store-layout.component';
import { StoreSummaryComponent } from '../../../shared/store-details/store-summary/store-summary.component';
import { StoreProductCategoriesComponent } from '../../../shared/store-details/store-product-categories/store-product-categories.component';

const routes: Routes = [
  {
    path: '', component: StoreDetailsComponent, children: [
      { path: 'productspreadsheet', component: ProductListingComponent, pathMatch: 'full' },
      { path: 'activeart', component: ActiveArtComponent, pathMatch: 'full' },
      {
        path: 'storesettings',
        loadChildren: () => import('../store-settings/store-settings.module').then(m => m.StoreSettingsModule)
      },
      { path: 'reviewproduct', component: ReviewProductsComponent, pathMatch: 'full' },
      { path: 'couponsanddiscounts', component: CouponsDiscountsComponent, pathMatch: 'full' },
      { path: 'styleeditor', component: StoreStyleEditorComponent, pathMatch: 'full' },
      { path: 'storelayout', component: StoreLayoutComponent, pathMatch: 'full' },
      { path: 'storesummary', component: StoreSummaryComponent, pathMatch: 'full' },
      { path: 'storeproductcategories', component: StoreProductCategoriesComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreDetailsRoutingModule { }
