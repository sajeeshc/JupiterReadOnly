import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreDetailsComponent } from './store-details.component'
import { ProductListingComponent } from './product-listing/product-listing.component';
import { ActiveArtComponent } from './active-art/active-art.component';
import { ReviewProductsComponent } from './review-products/review-products.component';
import { CouponsDiscountsComponent } from './coupons-discounts/coupons-discounts.component';
import { StoreStyleEditorComponent} from './store-style-editor/store-style-editor.component';
import { StoreLayoutComponent } from './store-layout/store-layout.component';
import { StoreSummaryComponent } from './store-summary/store-summary.component';
import { StoreProductCategoriesComponent } from './store-product-categories/store-product-categories.component';

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
