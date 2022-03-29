import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreSettingsComponent } from '../../shared/store-settings/store-settings.component';
import { StoreNameComponent } from '../../shared/store-settings/store-name/store-name.component';
import { PrivacySettingsComponent } from '../../shared/store-settings/privacy-settings/privacy-settings.component';
import { SocialMediaComponent } from '../../shared/store-settings/social-media/social-media.component';
import { StoreContactComponent } from '../../shared/store-settings/store-contact/store-contact.component';
import { StoreNotificationsComponent } from '../../shared/store-settings/store-notifications/store-notifications.component';
import { StoreCommissionComponent } from '../../shared/store-settings/store-commission/store-commission.component';
import { StoreProductdisplayComponent } from '../../shared/store-settings/store-productdisplay/store-productdisplay.component';
import { sanitizeIdentifier } from '@angular/compiler';
import { StoreBrandingComponent } from '../../shared/store-settings/store-branding/store-branding.component';
import { StoreDeveloperComponent } from '../../shared/store-settings/store-developer/store-developer.component';
import { StoreDomainComponent } from '../../shared/store-settings/store-domain/store-domain.component';
import { StoreClosedPageComponent } from '../../shared/store-settings/store-closed-page/store-closed-page.component';
import { ShippingMethodsComponent } from '../../shared/store-settings/shipping-methods/shipping-methods.component';
import { CheckoutSettingsComponent } from '../../shared/store-settings/checkout-settings/checkout-settings.component';
import { SeoSettingsComponent } from '../../shared/store-settings/seo-settings/seo-settings.component';
import { DeveloperSettingsComponent } from '../../shared/store-settings/developer-settings/developer-settings.component';
import { StorePickupComponent } from '../../shared/store-settings/store-pickup/store-pickup.component';
import { ProductionScheduleComponent } from '../../shared/store-settings/production-schedule/production-schedule.component';
import { StorePoliciesComponent } from '../../shared/store-settings/store-policies/store-policies.component';
import { DesignerSettingsComponent } from '../../shared/store-settings/designer-settings/designer-settings.component';
import { CustomOrderFieldsComponent } from '../../shared/store-settings/custom-order-fields/custom-order-fields.component';
import { OrderReceiptComponent } from './mail-template/order-receipt/order-receipt.component';
import { StoreLiveComponent } from './mail-template/store-live/store-live.component';
import { StoreVerificationComponent } from './mail-template/store-verification/store-verification.component';
import { DisclaimerBannerTopComponent } from './mail-template/disclaimer-banner-top/disclaimer-banner-top.component';


const routes: Routes = [
  {
    path: '', component: StoreSettingsComponent, children: [
      { path: 'storename', component: StoreNameComponent, pathMatch: 'full' },
      { path: 'privacysettings', component: PrivacySettingsComponent, pathMatch: 'full' },
      { path: 'socialmedia', component: SocialMediaComponent, pathMatch: 'full' },
      { path: 'storecontact', component: StoreContactComponent, pathMatch: 'full' },
      { path: 'storenotifications', component: StoreNotificationsComponent, pathMatch: 'full' },
      { path: 'storebranding', component: StoreBrandingComponent, pathMatch: 'full' },
      { path: 'storedeveloper', component: StoreDeveloperComponent, pathMatch: 'full' },
      { path: 'storecommission', component: StoreCommissionComponent, pathMatch: 'full' },
      { path: 'storedisplay', component: StoreProductdisplayComponent, pathMatch: 'full' },
      // { path: 'shippingmethods', component: ShippingMethodsComponent, pathMatch: 'full' },
      { path: 'shippingandpickupmethods', component: ShippingMethodsComponent, pathMatch: 'full' },
      { path: 'storeclosedpage', component: StoreClosedPageComponent, pathMatch: 'full' },
      { path: 'checkoutsettings', component: CheckoutSettingsComponent, pathMatch: 'full' },
      { path: 'seosettings', component: SeoSettingsComponent, pathMatch: 'full' },
      { path: 'storepickup', component: StorePickupComponent, pathMatch: 'full' },
      { path: 'productionschedule', component: ProductionScheduleComponent, pathMatch: 'full' },
      { path: 'storepolicies', component: StorePoliciesComponent, pathMatch: 'full' },
      { path: 'designer', component: DesignerSettingsComponent, pathMatch: 'full' },
      { path: 'customorderfields', component: CustomOrderFieldsComponent, pathMatch: 'full' },
      { path: 'orderreceipt', component: OrderReceiptComponent, pathMatch: 'full' },
      { path: 'banner-top', component: DisclaimerBannerTopComponent, pathMatch: 'full' },
      { path: 'storelive', component: StoreLiveComponent, pathMatch: 'full' },
      { path: 'storeverification', component: StoreVerificationComponent, pathMatch: 'full' },
      // { path: 'reviewproduct', component: ReviewProductsComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreSettingsRoutingModule { }
