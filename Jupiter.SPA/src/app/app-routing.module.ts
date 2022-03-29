import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserLoginComponent } from '../app/modules/pages/user-login/user-login.component';
import { LoginComponent } from '../app/modules/pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { StoreLayoutComponent } from './shared/store-details/store-layout/store-layout.component';
import { VerifyArtComponent } from './shared/verify-art/verify-art.component';
import { VerifyUserComponent } from './shared/verify-user/verify-user.component';
import { VerifyTeamstoreComponent } from './shared/verify-teamstore/verify-teamstore.component';
import { VerifyArtDetailComponent } from './shared/verify-art-detail/verify-art-detail.component';
import { ViewArtComponent } from './shared/view-art/view-art.component';

// import { HomeComponent } from '../app/modules/user/home/home.component';
// import { LoginComponent } from '../app/modules/user/login/login.component';
// import { AuthGuard } from '../app/core/guards/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'userlogin', component: UserLoginComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'store/:storeId', component: StoreLayoutComponent, pathMatch: 'full' },
  { path: 'verifystore/:storeId', component: VerifyTeamstoreComponent, pathMatch: 'full' },
  { path: 'verifyuser/:userId', component: VerifyUserComponent, pathMatch: 'full' },
  { path: 'verifyart/:artQueueId/:artId', component: VerifyArtComponent, pathMatch: 'full' },
  { path: 'viewart/:artQueueId', component: ViewArtComponent, pathMatch: 'full' },
  { path: 'verifyart/:artQueueId/:artId/:orderId', component: VerifyArtDetailComponent, pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'superadmin',
    loadChildren: () => import('./modules/super-admin/super-admin.module').then(m => m.SuperAdminModule),
  },
  {
    path: 'storebuilder',
    loadChildren: () => import('./modules/team-store-builder/team-store-builder.module').then(m => m.TeamStoreBuilderModule),
    canActivate: [AuthGuard],
    data: {
      expectedRole: "DESIGNER"
    }
  },
  {
    path: 'storemanager',
    loadChildren: () => import('./modules/team-store-manager/team-store-manager.module').then(m => m.TeamStoreManagerModule),
    canActivate: [AuthGuard],
    data: {
      expectedRole: "TASKCREATOR"
    }
  },
  {
    path: 'financemanager',
    loadChildren: () => import('./modules/finance-manager/finance-manager.module').then(m => m.FinanceManagerModule),
    canActivate: [AuthGuard],
    data: {
      expectedRole: "FINANCEMANAGER"
    }
  },
  {
    path: 'artadmin',
    loadChildren: () => import('./modules/art-admin/art-admin.module').then(m => m.ArtAdminModule),
    // canActivate: [AuthGuard],
    // data: {
    //   expectedRole: "ARTADMIN"
    // }
  },
  {
    path: 'enduser',
    loadChildren: () => import('./modules/end-user/end-user.module').then(m => m.EndUserModule),
    // canActivate:[AuthGuard],
    // data:{
    //   expectedRole : "TASKCREATOR"
    // }
  },
  {
    path: 'artprocess',
    loadChildren: () => import('./modules/art-process/art-process.module').then(m => m.ArtProcessModule),
  },
  {
    path: 'artdirector',
    loadChildren: () => import('./modules/art-director/art-director.module').then(m => m.ArtDirectorModule),
  },
  {
    path: 'productmanager',
    loadChildren: ()=> import('./modules/product/product.module').then(m => m.ProductModule),
    canActivate: [AuthGuard],
    data: {
      expectedRole: "PRODUCTMANAGER"
    }
  }
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
export const AppRoutingModule = RouterModule.forRoot(routes);
