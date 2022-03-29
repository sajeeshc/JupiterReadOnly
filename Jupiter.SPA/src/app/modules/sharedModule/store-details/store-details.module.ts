import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { StoreDetailsComponent } from './store-details.component'
import { StoreDetailsRoutingModule } from './store-details-routing.module';

@NgModule({
  declarations: [
    StoreDetailsComponent
  ],
  imports: [
    SharedModule,
    StoreDetailsRoutingModule
  ]
})
export class StoreDetailsModule { }
