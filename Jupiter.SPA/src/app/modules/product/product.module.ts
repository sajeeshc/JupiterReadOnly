import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ProductDashoardComponent } from './product-dashoard/product-dashoard.component';
import { ProductDataComponent } from './product-data/product-data.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { ProductSettingsComponent } from './product-settings/product-settings.component';
import { ProductCategoryComponent } from './product-settings/product-category/product-category.component';
import { ProductGroupComponent } from './product-settings/product-group/product-group.component';
import { MarginCalcComponent } from './product-settings/margin-calc/margin-calc.component';
import { DecoPositionsComponent } from './product-settings/deco-positions/deco-positions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicesComponent } from './product-settings/services/services.component';
import { StoreStatusComponent } from './product-settings/store-status/store-status.component';
import { CreatePromotionComponent } from './create-promotion/create-promotion.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { DecoGroupComponent } from './product-settings/deco-group/deco-group.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AddProductComponent } from './add-product/add-product.component';
import { ItemTypeComponent } from './product-settings/item-type/item-type.component';
import { BoxComponent } from './product-settings/box/box.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { UpdateDecoGroupComponent } from './product-settings/deco-group/update-deco-group/update-deco-group.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ProductListComponent } from './product-list/product-list.component';
import { SetCategoryComponent } from './set-category/set-category.component';
import { SetDecoGroupComponent } from './set-deco-group/set-deco-group.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BulkSizeChartComponent } from './bulk-size-chart/bulk-size-chart.component';

@NgModule({
  declarations: [
    ProductComponent,
    ProductDashoardComponent,
    ProductDataComponent,
    ProductManagementComponent,
    ProductSettingsComponent,
    ProductCategoryComponent,
    ProductGroupComponent,
    MarginCalcComponent,
    DecoPositionsComponent,
    ServicesComponent,
    StoreStatusComponent,
    CreatePromotionComponent,
    PromotionListComponent,
    DecoGroupComponent,
    AddProductComponent,
    ItemTypeComponent,
    BoxComponent,
    UpdateDecoGroupComponent,
    ProductListComponent,
    SetCategoryComponent,
    SetDecoGroupComponent,
    BulkSizeChartComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    NgxSliderModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatMomentDateModule,
    MatTabsModule,
    DragDropModule,
    
  ]
})
export class ProductModule { }
