import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatCheckboxModule, MatPaginatorModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from "@angular/material";
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ColorPickerModule } from 'ngx-color-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { SharedRoutingModule } from './shared-routing.module';

import { DesignerComponent } from './designer/designer.component';
import { Layout1Component } from './layoutComponents/layout1/layout1.component';
import { Layout2Component } from './layoutComponents/layout2/layout2.component';
import { ViewLayout1Component } from './viewStoreComponents/view-layout1/view-layout1.component';
import { ViewLayout2Component } from './viewStoreComponents/view-layout2/view-layout2.component';
import { ProductSelectionComponent } from './product-selection/product-selection.component';
import { StoreListComponent } from './store-list/store-list.component';
import { ViewStoreComponent } from './view-store/view-store.component';


import { StoreDetailsComponent } from './store-details/store-details.component';
import { ProductListingComponent } from './store-details/product-listing/product-listing.component'
import { ActiveArtComponent } from './store-details/active-art/active-art.component';
import { ReviewProductsComponent } from './store-details/review-products/review-products.component';
import { CouponsDiscountsComponent } from './store-details/coupons-discounts/coupons-discounts.component';
import { StoreStyleEditorComponent } from './store-details/store-style-editor/store-style-editor.component';
import { StoreLayoutComponent } from './store-details/store-layout/store-layout.component';
import { StoreSummaryComponent } from './store-details/store-summary/store-summary.component';
import { StoreProductCategoriesComponent } from './store-details/store-product-categories/store-product-categories.component';

import { StoreSettingsComponent } from './store-settings/store-settings.component';
import { StoreNameComponent } from './store-settings/store-name/store-name.component';
import { PrivacySettingsComponent } from './store-settings/privacy-settings/privacy-settings.component';
import { SocialMediaComponent } from './store-settings/social-media/social-media.component';
import { StoreContactComponent } from './store-settings/store-contact/store-contact.component';
import { StoreNotificationsComponent } from './store-settings/store-notifications/store-notifications.component';
import { StoreCommissionComponent } from './store-settings/store-commission/store-commission.component';
import { StoreProductdisplayComponent } from './store-settings/store-productdisplay/store-productdisplay.component';
import { StoreBrandingComponent } from './store-settings/store-branding/store-branding.component';
import { StoreDomainComponent } from './store-settings/store-domain/store-domain.component';
import { StoreDeveloperComponent } from './store-settings/store-developer/store-developer.component';
import { StoreClosedPageComponent } from './store-settings/store-closed-page/store-closed-page.component';
import { ShippingMethodsComponent } from './store-settings/shipping-methods/shipping-methods.component';
import { CheckoutSettingsComponent } from './store-settings/checkout-settings/checkout-settings.component';
import { SeoSettingsComponent } from './store-settings/seo-settings/seo-settings.component';
import { DeveloperSettingsComponent } from './store-settings/developer-settings/developer-settings.component';
import { StorePickupComponent } from './store-settings/store-pickup/store-pickup.component';
import { ProductionScheduleComponent } from './store-settings/production-schedule/production-schedule.component';
import { StorePoliciesComponent } from './store-settings/store-policies/store-policies.component';
import { CustomOrderFieldsComponent } from './store-settings/custom-order-fields/custom-order-fields.component';
import { DesignerSettingsComponent } from './store-settings/designer-settings/designer-settings.component';
import { CountDownTimerComponent } from './count-down-timer/count-down-timer.component';

import { ProductViewComponent } from './product-view/product-view.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { VerifyArtComponent } from './verify-art/verify-art.component';
import { VerifyTeamstoreComponent } from './verify-teamstore/verify-teamstore.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { QuillModule } from 'ngx-quill-v2';
import { VerifyArtDetailComponent } from './verify-art-detail/verify-art-detail.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { ViewArtComponent } from './view-art/view-art.component';

@NgModule({
  declarations: [
    DesignerComponent,
    Layout1Component,
    Layout2Component,
    ViewLayout1Component,
    ViewLayout2Component,
    ProductSelectionComponent,
    StoreListComponent,
    ViewStoreComponent,

    StoreDetailsComponent,
    ProductListingComponent,
    ActiveArtComponent,
    ReviewProductsComponent,
    CouponsDiscountsComponent,
    StoreLayoutComponent,
    StoreSummaryComponent,
    StoreProductCategoriesComponent,
    StoreStyleEditorComponent,

    StoreSettingsComponent,
    StoreNameComponent,
    PrivacySettingsComponent,
    SocialMediaComponent,
    StoreNotificationsComponent,
    StoreCommissionComponent,
    StoreContactComponent,
    StoreNotificationsComponent,
    StoreProductdisplayComponent,
    StoreClosedPageComponent,
    ShippingMethodsComponent,
    StoreBrandingComponent,
    StoreDomainComponent,
    StoreDeveloperComponent,
    StoreClosedPageComponent,
    CheckoutSettingsComponent,
    SeoSettingsComponent,
    DeveloperSettingsComponent,
    StorePickupComponent,
    ProductionScheduleComponent,
    StorePoliciesComponent,
    DesignerComponent,
    CustomOrderFieldsComponent,
    DesignerSettingsComponent,
    CountDownTimerComponent,

    ProductViewComponent,
    CartComponent,
    CheckoutComponent,
    VerifyArtComponent,
    VerifyTeamstoreComponent,
    VerifyUserComponent,
    CountDownTimerComponent,
    VerifyArtDetailComponent,
    ViewArtComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedRoutingModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatGridListModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule,
    QuillModule,

    ColorPickerModule,
    DragDropModule,
    NgxMaterialTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatGridListModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatChipsModule,
    QuillModule,

    ColorPickerModule,
    DragDropModule,
    NgxMaterialTimepickerModule,
    QuillModule,


    DesignerComponent,
    Layout1Component,
    Layout2Component,
    ViewLayout1Component,
    ViewLayout2Component,
    ProductSelectionComponent,
    StoreListComponent,
    ViewStoreComponent,

    StoreDetailsComponent,
    ProductListingComponent,
    ActiveArtComponent,
    ReviewProductsComponent,
    CouponsDiscountsComponent,
    StoreLayoutComponent,
    StoreSummaryComponent,
    StoreProductCategoriesComponent,
    StoreStyleEditorComponent,

    StoreSettingsComponent,
    StoreNameComponent,
    PrivacySettingsComponent,
    SocialMediaComponent,
    StoreNotificationsComponent,
    StoreCommissionComponent,
    StoreContactComponent,
    StoreNotificationsComponent,
    StoreProductdisplayComponent,
    StoreClosedPageComponent,
    ShippingMethodsComponent,
    StoreBrandingComponent,
    StoreDomainComponent,
    StoreDeveloperComponent,
    StoreClosedPageComponent,
    CheckoutSettingsComponent,
    SeoSettingsComponent,
    DeveloperSettingsComponent,
    StorePickupComponent,
    ProductionScheduleComponent,
    StorePoliciesComponent,
    DesignerComponent,
    CustomOrderFieldsComponent,
    DesignerSettingsComponent,
    CountDownTimerComponent,

    ProductViewComponent,
    CartComponent,
    CheckoutComponent
  ]
})
export class SharedModule { }
