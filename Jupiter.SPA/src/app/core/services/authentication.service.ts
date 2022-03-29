import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { User } from "../models/user";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private baseUrl = environment.apiUrl + "auth/";

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(model: any) {
    return this.http.post(this.baseUrl + "login", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem("token", user.token);
          localStorage.setItem("refreshToken", user.refreshToken);
          localStorage.setItem("user", JSON.stringify(user.user));
          localStorage.setItem("userId", JSON.stringify(user.user.id));
          this.currentUserSubject.next(user);
          this.currentUser = user;
          return response;
        }
      })
    );
  }

  logout(model: any) {
    // remove user from local storage and set current user to null
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    return this.http.post(this.baseUrl + "logout", model).pipe(
      map((response: any) => {
        if(response == true){
          localStorage.removeItem("currentUser");
          this.currentUserSubject.next(null);
        }
        return response;
      })
    );
  }

  getUserByAuthKey(auth, key){
    const url = environment.apiUrl + 'users/security/' + auth + '/key/' + key
    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
