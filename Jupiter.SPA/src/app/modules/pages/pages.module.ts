import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PagesRoutingModule } from "./pages-routing.module";
import { UserLoginComponent } from "./user-login/user-login.component";
import { LoginComponent } from "./login/login.component";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [UserLoginComponent, LoginComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class PagesModule {}
