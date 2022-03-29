import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtImgListComponent } from './art-img-list/art-img-list.component';
import { ArtListComponent } from './art-list/art-list.component';
import { ArtProcessComponent } from './art-process.component';
import { ArtQueuelistComponent } from './art-queuelist/art-queuelist.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '', component: ArtProcessComponent, children: [
      { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
      { path: 'artqueuelist', component: ArtQueuelistComponent, pathMatch: 'full' },
      { path: 'artlist', component: ArtListComponent, pathMatch: 'full' },
      { path: 'artImglist/:artId', component: ArtImgListComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtProcessRoutingModule { }
