import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "../app/core/services/authentication.service";
import { User } from "../app/core/models/user";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Jupiter";

  constructor() {}
}
