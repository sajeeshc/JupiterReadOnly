import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ArtProcessRoutingModule } from './art-process-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArtListComponent } from './art-list/art-list.component';
import { ArtImgListComponent } from './art-img-list/art-img-list.component';
import { ArtProcessComponent } from './art-process.component';
import { ArtQueuelistComponent } from './art-queuelist/art-queuelist.component';

@NgModule({
  declarations: [
    ArtProcessComponent,
    DashboardComponent,
    ArtListComponent,
    ArtImgListComponent,
    ArtQueuelistComponent
  ],
  imports: [
    SharedModule,
    ArtProcessRoutingModule,
  ],
  exports: [
    ArtProcessComponent,
    DashboardComponent,
    ArtListComponent,
    ArtImgListComponent,
    ArtQueuelistComponent
  ]
})
export class ArtProcessModule { }
