import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamStoreBuilderComponent } from './team-store-builder.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StorerequestComponent } from './store-request/store-request.component';
import { StoreRequestlistComponent } from './store-request-list/store-request-list.component';
import { StorespecificationComponent } from './store-specification/store-specification.component';
import { ProductSelectionComponent } from './../../shared/product-selection/product-selection.component';
import { DesignerComponent } from './../../shared/designer/designer.component'
import { StoreRequestManagementComponent } from './store-request-management/store-request-management.component';
import { ArtQueuelistComponent } from '../art-process/art-queuelist/art-queuelist.component';
import { ArtListComponent } from '../art-process/art-list/art-list.component';
import { ArtImgListComponent } from '../art-process/art-img-list/art-img-list.component';
import { RejectedArtListComponent } from './rejected-art-list/rejected-art-list.component';
import { StoreListComponent } from '../../shared/store-list/store-list.component';

const routes: Routes = [
  {
    path: '', component: TeamStoreBuilderComponent, children: [
      { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
      { path: 'storerequest', component: StorerequestComponent, pathMatch: 'full' },
      { path: 'storerequestlist', component: StoreRequestlistComponent, pathMatch: 'full' },
      { path: 'storespecification', component: StorespecificationComponent, pathMatch: 'full' },
      { path: 'productselection', component: ProductSelectionComponent, pathMatch: 'full' },
      { path: 'designer/:productId', component: DesignerComponent, pathMatch: 'full' },
      { path: 'artlist', component: ArtListComponent, pathMatch: 'full' },
      { path: 'artqueuelist', component: ArtQueuelistComponent, pathMatch: 'full' },
      { path: 'artImglist/:artId', component: ArtImgListComponent, pathMatch: 'full' },
      { path: 'storerequestmanagement/:type', component: StoreRequestManagementComponent, pathMatch: 'full' },
      { path: 'storerequestmanagement/:type/:status', component: StoreRequestManagementComponent, pathMatch: 'full' },
      { path: 'rejectedartlist', component: RejectedArtListComponent, pathMatch: 'full' },
      {
        path: 'storedetails',
        loadChildren: () => import('../../shared/store-details/store-details.module').then(m => m.StoreDetailsModule)
      },
      { path: 'storelist/:stage', component: StoreListComponent, pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamStoreBuilderRoutingModule { }
