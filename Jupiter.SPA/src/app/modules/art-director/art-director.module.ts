import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatCheckboxModule, MatPaginatorModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

import { ArtDirectorRoutingModule } from './art-director-routing.module';
import { ArtDirectorComponent } from './art-director.component';
import { DownloadArtComponent } from './download-art/download-art.component';
import { ArtVerificationListComponent } from './art-verification-list/art-verification-list.component';
import { OrderArtListComponent } from './order-art-list/order-art-list.component';
import { OrderArtDetailComponent } from './order-art-detail/order-art-detail.component';


@NgModule({
  declarations: [ArtDirectorComponent, DownloadArtComponent, ArtVerificationListComponent, OrderArtListComponent, OrderArtDetailComponent],
  imports: [
    CommonModule,
    ArtDirectorRoutingModule,
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
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ArtDirectorModule { }
