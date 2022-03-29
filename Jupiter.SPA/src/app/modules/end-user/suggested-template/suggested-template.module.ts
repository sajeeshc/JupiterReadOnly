import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatCheckboxModule, MatFormFieldModule } from "@angular/material";
import { FormsModule } from '@angular/forms';


import { SuggestedTemplateRoutingModule } from './suggested-template-routing.module';
import { SuggestedTemplateComponent } from './suggested-template.component';
import { SuggestedStoreListComponent } from './suggested-store-list/suggested-store-list.component';
import { StoreRequestComponent } from './store-request/store-request.component';
import { StoreSpecificationComponent } from './store-specification/store-specification.component';

import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from "@angular/forms";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { ColorPickerModule } from 'ngx-color-picker';
import { MatChipsModule } from '@angular/material/chips';
import { CreateStoreComponent } from './create-store/create-store.component';


@NgModule({
  declarations: [
    SuggestedStoreListComponent,
    SuggestedTemplateComponent,
    StoreRequestComponent,
    StoreSpecificationComponent,
    CreateStoreComponent
  ],
  imports: [
    CommonModule,
    SuggestedTemplateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
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
    MatChipsModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatAutocompleteModule,
    MatCheckboxModule,
    ColorPickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatMomentDateModule
  ]
})
export class SuggestedTemplateModule { }
