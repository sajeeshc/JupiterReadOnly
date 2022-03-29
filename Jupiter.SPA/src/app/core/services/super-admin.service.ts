import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getUserWithRoles () {
    return this.http.get(this.baseUrl + "users?per_page=0").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }


  getUserInfo (id:any) {
    return this.http.get(this.baseUrl + "users/"+id).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getRoles() {
    return this.http.get(this.baseUrl + "users/roles").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }


  createUserWithRole (model: any) {
    return this.http.post(this.baseUrl + "users/add", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  updateUserWithRole (model: any,id:any) {
    return this.http.post(this.baseUrl + "users/"+id+"/update", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  deleteUser (userId: number) {
    return this.http.delete(this.baseUrl + "users/"+userId).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  
}
