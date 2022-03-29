import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreSettingsRoutingModule } from './store-settings-routing.module';
import { QuillModule } from 'ngx-quill-v2';
import { OrderReceiptComponent } from './mail-template/order-receipt/order-receipt.component';
import { StoreLiveComponent } from './mail-template/store-live/store-live.component';
import { StoreVerificationComponent } from './mail-template/store-verification/store-verification.component';
import { DisclaimerBannerTopComponent } from './mail-template/disclaimer-banner-top/disclaimer-banner-top.component';
@NgModule({
  declarations: [OrderReceiptComponent, StoreLiveComponent, StoreVerificationComponent, DisclaimerBannerTopComponent],
  imports: [
    SharedModule,
    StoreSettingsRoutingModule,
    QuillModule
  ]
})
export class StoreSettingsModule { }
