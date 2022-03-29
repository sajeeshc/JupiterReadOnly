import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ArtProcessModule } from '../art-process/art-process.module';

import { TeamStoreBuilderRoutingModule } from './team-store-builder-routing.module';
import { TeamStoreBuilderComponent } from './team-store-builder.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StoreRequestlistComponent } from './store-request-list/store-request-list.component';
import { StorerequestComponent } from './store-request/store-request.component';
import { StorespecificationComponent } from './store-specification/store-specification.component';
import { StoreRequestManagementComponent } from './store-request-management/store-request-management.component';
// import { ArtListComponent } from '../art-process/art-list/art-list.component';
// import { ArtImgListComponent } from '../art-process/art-img-list/art-img-list.component';

import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RejectedArtListComponent } from './rejected-art-list/rejected-art-list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    StoreRequestlistComponent,
    StorerequestComponent,
    StorespecificationComponent,
    TeamStoreBuilderComponent,
    StoreRequestManagementComponent,
    RejectedArtListComponent,
    // ArtListComponent,
    // ArtImgListComponent
  ],
  imports: [
    SharedModule,    
    TeamStoreBuilderRoutingModule,
    ArtProcessModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatMomentDateModule
  ]
})
export class TeamStoreBuilderModule { }
