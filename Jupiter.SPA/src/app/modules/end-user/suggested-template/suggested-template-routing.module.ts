import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuggestedStoreListComponent } from './suggested-store-list/suggested-store-list.component';
import { SuggestedTemplateComponent } from './suggested-template.component';
import { StoreRequestComponent } from './store-request/store-request.component';
import { StoreSpecificationComponent } from './store-specification/store-specification.component';
import { CreateStoreComponent } from './create-store/create-store.component';

const routes: Routes = [
  {
    path: '', component: SuggestedTemplateComponent, children: [
      { path: 'suggestedstorelist', component: SuggestedStoreListComponent, pathMatch: 'full' },
      { path: 'create-store', component: CreateStoreComponent, pathMatch: 'full' },
      { path: 'storerequest/:teamStoreId', component: StoreRequestComponent, pathMatch: 'full' },
      { path: 'storespecification', component: StoreSpecificationComponent, pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuggestedTemplateRoutingModule { }
