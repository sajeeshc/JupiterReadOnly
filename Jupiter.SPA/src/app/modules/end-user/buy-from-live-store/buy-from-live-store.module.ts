import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { BuyFromLiveStoreRoutingModule } from './buy-from-live-store-routing.module';
import { BuyFromLiveStoreComponent } from './buy-from-live-store.component';
import { StoreselectionComponent } from './storeselection/storeselection.component';
import { StoreComponent } from './store/store.component';
import { FindMyStoreComponent } from './find-my-store/find-my-store.component';

@NgModule({
  declarations: [
    StoreselectionComponent,
    BuyFromLiveStoreComponent,
    StoreComponent,
    FindMyStoreComponent
  ],
  imports: [
    SharedModule,
    BuyFromLiveStoreRoutingModule
  ]
})
export class BuyFromLiveStoreModule { }
