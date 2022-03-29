import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtDirectorComponent } from './art-director.component';
import { ArtVerificationListComponent } from './art-verification-list/art-verification-list.component';
import { DownloadArtComponent } from './download-art/download-art.component';
import { OrderArtDetailComponent } from './order-art-detail/order-art-detail.component';
import { OrderArtListComponent } from './order-art-list/order-art-list.component';


const routes: Routes = [
  {
    path: '', component: ArtDirectorComponent, children: [
      { path: 'downloadart', component: DownloadArtComponent, pathMatch: 'full' },
      { path: 'orderArtList', component: OrderArtListComponent, pathMatch: 'full' },
      { path: 'artverification', component: ArtVerificationListComponent, pathMatch: 'full' },
      { path: 'orderArtDetail', component: OrderArtDetailComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtDirectorRoutingModule { }
