import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesignerComponent } from '../../../shared/designer/designer.component';
import { ProductSelectionComponent } from '../../../shared/product-selection/product-selection.component';
import { BuildOwnStoreComponent } from './build-own-store.component';
import { StoreRequestComponent } from './store-request/store-request.component';
import { StoreSpecificationComponent } from './store-specification/store-specification.component';


const routes: Routes = [
  {
    path: '', component: BuildOwnStoreComponent, children: [
      { path: 'storerequest', component: StoreRequestComponent, pathMatch: 'full' },
      { path: 'storespecification', component: StoreSpecificationComponent, pathMatch: 'full' },
      { path: 'productselection', component: ProductSelectionComponent, pathMatch: 'full' },
      { path: 'designer/:productId', component: DesignerComponent, pathMatch: 'full' },
      {
        path: 'storedetails',
        loadChildren: () => import('../../../shared/store-details/store-details.module').then(m => m.StoreDetailsModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildOwnStoreRoutingModule { }
