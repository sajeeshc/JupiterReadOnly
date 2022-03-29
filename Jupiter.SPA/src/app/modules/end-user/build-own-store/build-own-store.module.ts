import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { BuildOwnStoreRoutingModule } from './build-own-store-routing.module';
import { StoreRequestComponent } from './store-request/store-request.component';
import { BuildOwnStoreComponent } from './build-own-store.component';
import { StoreSpecificationComponent } from './store-specification/store-specification.component';
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";

import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
@NgModule({
  declarations: [
    StoreRequestComponent,
    BuildOwnStoreComponent,
    StoreSpecificationComponent,
  ],
  imports: [
    SharedModule,
    BuildOwnStoreRoutingModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatMomentDateModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    // MatAutocompleteModule,
    // MatCheckboxModule,
    // ColorPickerModule,
    // MatDividerModule,
    // FormsModule,
    

  ]
})
export class BuildOwnStoreModule { }
