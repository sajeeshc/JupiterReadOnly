import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { AppComponent } from './app.component';
import { AlertComponent } from './core/components/alert/alert.component';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from "@angular/material";

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { UserLoginComponent } from '../app/modules/pages/user-login/user-login.component';
import { LoginComponent } from '../app/modules/pages/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    UserLoginComponent,
    LoginComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatInputModule,
    BrowserAnimationsModule,
    NgxMaterialTimepickerModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
