import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

// import { CommonModule } from '@angular/common';
// import { StoreSettingsComponent } from './store-settings.component';
import { StoreSettingsRoutingModule } from './store-settings-routing.module';

// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatCardModule } from '@angular/material/card';
// import { MatTableModule } from '@angular/material/table';
// import { MatInputModule } from '@angular/material/input';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule, MatCheckboxModule, MatPaginatorModule } from '@angular/material';
// import { MatIconModule } from '@angular/material/icon';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatSelectModule } from '@angular/material/select';
// import { MatRadioModule } from '@angular/material/radio';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatListModule } from '@angular/material/list';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { StoreNameComponent } from './store-name/store-name.component';
// import { PrivacySettingsComponent } from './privacy-settings/privacy-settings.component';
// import { SocialMediaComponent } from './social-media/social-media.component';
// import { StoreContactComponent } from './store-contact/store-contact.component';
// import { StoreNotificationsComponent } from './store-notifications/store-notifications.component';
// import { StoreCommissionComponent } from './store-commission/store-commission.component';
// import { StoreProductdisplayComponent } from './store-productdisplay/store-productdisplay.component';
// import { StoreBrandingComponent } from './store-branding/store-branding.component';
// import { StoreDomainComponent } from './store-domain/store-domain.component';
// import { StoreDeveloperComponent } from './store-developer/store-developer.component';
// import { StoreClosedPageComponent } from './store-closed-page/store-closed-page.component';
// import { ShippingMethodsComponent } from './shipping-methods/shipping-methods.component';
// import {DragDropModule} from '@angular/cdk/drag-drop';
// import { CheckoutSettingsComponent } from './checkout-settings/checkout-settings.component';
// import { SeoSettingsComponent } from './seo-settings/seo-settings.component';
// import { DeveloperSettingsComponent } from './developer-settings/developer-settings.component';
// import { StorePickupComponent } from './store-pickup/store-pickup.component';
// import { ProductionScheduleComponent } from './production-schedule/production-schedule.component';
// import { StorePoliciesComponent } from './store-policies/store-policies.component';

// import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
// import { DesignerComponent } from './designer/designer.component';
// import { CustomOrderFieldsComponent } from './custom-order-fields/custom-order-fields.component';


@NgModule({
  declarations: [
    // StoreSettingsComponent,
    // StoreNameComponent,
    // PrivacySettingsComponent,
    // SocialMediaComponent,
    // StoreNotificationsComponent,
    // StoreCommissionComponent,
    // StoreContactComponent,
    // StoreNotificationsComponent,
    // StoreProductdisplayComponent,
    // StoreClosedPageComponent,
    // ShippingMethodsComponent,
    // StoreBrandingComponent,
    // StoreDomainComponent,
    // StoreDeveloperComponent,
    // StoreClosedPageComponent,
    // CheckoutSettingsComponent,
    // SeoSettingsComponent,
    // DeveloperSettingsComponent,
    // StorePickupComponent,
    // ProductionScheduleComponent,
    // StorePoliciesComponent,
    // DesignerComponent,
    // CustomOrderFieldsComponent,
  ],
  imports: [
    // DragDropModule,
    SharedModule,
    StoreSettingsRoutingModule,
    // MatToolbarModule,
    // MatCardModule,
    // MatTableModule,
    // MatInputModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatIconModule,
    // MatGridListModule,
    // MatRadioModule,
    // ReactiveFormsModule,
    // MatSelectModule,
    // MatCheckboxModule,
    // MatListModule,
    // MatSlideToggleModule,
    // MatSidenavModule,
    // MatPaginatorModule,
    // MatExpansionModule,
    // NgxMaterialTimepickerModule
  ]
})
export class StoreSettingsModule { }
