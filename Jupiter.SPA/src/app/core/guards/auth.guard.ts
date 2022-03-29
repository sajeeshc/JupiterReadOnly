import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthenticationService } from "../services/authentication.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var user = JSON.parse(localStorage.getItem("user"));
    var token = localStorage.getItem("token");
    if (
      user != null &&
      token != null &&
      user.roles[0].name == route.data.expectedRole
    ) {
      // authorised so return true
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }
}
