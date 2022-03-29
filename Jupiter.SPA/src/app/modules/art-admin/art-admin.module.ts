import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ArtAdminComponent } from './art-admin.component';
import { ArtAdminRoutingModule } from './art-admin-routing.module';
import { ArtAdminDashboardComponent } from './art-admin-dashboard/art-admin-dashboard.component';
import { ArtPendingApprovalComponent } from './art-pending-approval/art-pending-approval.component';
import { ArtApprovalListComponent } from './art-approval-list/art-approval-list.component';
import { ArtApprovalHistoryComponent } from './art-approval-history/art-approval-history.component';
import { ArtDirectorRejectedListComponent } from './art-director-rejected-list/art-director-rejected-list.component';
import { ArtQueueListComponent } from './art-queue-list/art-queue-list.component';
import { ArtVerificationComponent } from './art-verification/art-verification.component';

@NgModule({
  declarations: [
    ArtAdminComponent,
    ArtAdminDashboardComponent,
    ArtPendingApprovalComponent,
    ArtApprovalListComponent,
    ArtApprovalHistoryComponent,
    ArtDirectorRejectedListComponent,
    ArtQueueListComponent,
    ArtVerificationComponent,
  ],
  imports: [
    SharedModule,
    ArtAdminRoutingModule,
  ],
  exports: [
    ArtAdminComponent,
    ArtAdminDashboardComponent,
    ArtPendingApprovalComponent,
    ArtApprovalListComponent,
    ArtApprovalHistoryComponent,
    ArtDirectorRejectedListComponent,
    ArtVerificationComponent
  ]
})
export class ArtAdminModule { }
