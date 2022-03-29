import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtAdminComponent } from './art-admin.component';
import { ArtAdminDashboardComponent } from './art-admin-dashboard/art-admin-dashboard.component';
import { ArtPendingApprovalComponent } from './art-pending-approval/art-pending-approval.component';
import { ArtApprovalListComponent } from './art-approval-list/art-approval-list.component';
import { ArtApprovalHistoryComponent } from './art-approval-history/art-approval-history.component';
import { ArtDirectorRejectedListComponent } from './art-director-rejected-list/art-director-rejected-list.component';
import { ArtQueueListComponent } from './art-queue-list/art-queue-list.component';
import { ArtVerificationComponent } from './art-verification/art-verification.component';

const routes: Routes = [
  {
    path: '', component: ArtAdminComponent, children: [
      { path: 'dashboard', component: ArtAdminDashboardComponent, pathMatch: 'full' },
      { path: 'artpendingapproval', component: ArtPendingApprovalComponent, pathMatch: 'full' },
      { path: 'artapprovallist', component: ArtApprovalListComponent, pathMatch: 'full' },
      { path: 'artapprovalhistory', component: ArtApprovalHistoryComponent, pathMatch: 'full' },
      { path: 'rejectedart', component: ArtDirectorRejectedListComponent, pathMatch: 'full' },
      { path: 'artqueuelist', component: ArtQueueListComponent, pathMatch: 'full' },
      { path: 'artverification', component: ArtVerificationComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtAdminRoutingModule { }
