import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreSettingsComponent } from './store-settings.component';
import { StoreNameComponent } from './store-name/store-name.component';
import { PrivacySettingsComponent } from './privacy-settings/privacy-settings.component';
import { SocialMediaComponent } from './social-media/social-media.component';
import { StoreContactComponent } from './store-contact/store-contact.component';
import { StoreNotificationsComponent } from './store-notifications/store-notifications.component';
import { StoreCommissionComponent } from './store-commission/store-commission.component';
import { StoreProductdisplayComponent } from './store-productdisplay/store-productdisplay.component';
import { sanitizeIdentifier } from '@angular/compiler';
import { StoreBrandingComponent } from './store-branding/store-branding.component';
import { StoreDeveloperComponent } from './store-developer/store-developer.component';
import { StoreDomainComponent } from './store-domain/store-domain.component';
import { StoreClosedPageComponent } from './store-closed-page/store-closed-page.component';
import { ShippingMethodsComponent } from './shipping-methods/shipping-methods.component';
import { CheckoutSettingsComponent } from './checkout-settings/checkout-settings.component';
import { SeoSettingsComponent } from './seo-settings/seo-settings.component';
import { DeveloperSettingsComponent } from './developer-settings/developer-settings.component';
import { StorePickupComponent } from './store-pickup/store-pickup.component';
import { ProductionScheduleComponent } from './production-schedule/production-schedule.component';
import { StorePoliciesComponent } from './store-policies/store-policies.component';
import { DesignerComponent } from './designer/designer.component';
import { CustomOrderFieldsComponent } from './custom-order-fields/custom-order-fields.component';


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
      { path: 'shippingmethods', component: ShippingMethodsComponent, pathMatch: 'full' },
      { path: 'storeclosedpage', component: StoreClosedPageComponent, pathMatch: 'full' },
      { path: 'checkoutsettings', component: CheckoutSettingsComponent, pathMatch: 'full' },
      { path: 'seosettings', component: SeoSettingsComponent, pathMatch: 'full' },
      { path: 'storepickup', component: StorePickupComponent, pathMatch: 'full' },
      { path: 'productionschedule', component: ProductionScheduleComponent, pathMatch: 'full' },
      { path: 'storepolicies', component: StorePoliciesComponent, pathMatch: 'full' },
      { path: 'designer', component: DesignerComponent, pathMatch: 'full' },
      { path: 'customorderfields', component: CustomOrderFieldsComponent, pathMatch: 'full' },
      // { path: 'reviewproduct', component: ReviewProductsComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreSettingsRoutingModule { }
