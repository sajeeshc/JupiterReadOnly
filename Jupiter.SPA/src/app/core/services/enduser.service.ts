import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnduserService {

  private baseUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient
  ) { }

  getOrganizations() {  
    return this.http.get(this.baseUrl + "users/organizations/v2").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
      );
  }


  getUserInfoUsingEmaiId(email:string) {  
    return this.http.get(this.baseUrl + "users/email/"+email).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
      );
  }

  getUserInfoUsingPhone(phone:string) {  
    return this.http.get(this.baseUrl + "users/phone/"+phone).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
      );
  }

  createOrganization (organization: any) {
    return this.http.post(this.baseUrl + "users/organizations",organization).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  createRequest ( formData : FormData) {
    return this.http.post(this.baseUrl + "v1/teamstore/requestfree",formData).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getUserTeamStores(name:string,dateFrom:string,dateTo:string,stage:number,params) {  
    return this.http.get(this.baseUrl + `users/teamstores?name=${name}&dateFrom=${dateFrom}&dateTo=${dateTo}&stage=${stage}&orderby=${params.orderBy || 'date'}&order=${params.order || 'desc'}&page=${params.page || '1'}&per_page=${params.per_page || '0'}`, { observe: "response" }).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
      );
  }

  updateDepartments(formData){
    return this.http.post(this.baseUrl + "users/departments/v1",formData).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getAllOrganizations(){
      return this.http.get(this.baseUrl + "users/organization/list").pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            return response;
          }
        })
        );
  }

  getAllStates(){
    return this.http.get(this.baseUrl + "v1/state/all").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
      );
}

  updateUserDepartments(formData){
    return this.http.post(this.baseUrl + "users/organizations/v2",formData).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getOrders(params?){
    return this.http.get(this.baseUrl + `v1/order/all?per_page=${params? params.per_page : 0}&page=${params? params.page : 1}`).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }
  
  getArtQueue(params){
    // getArtQueue(userId:number, value:boolean){
    return this.http.get(this.baseUrl + `v1/artqueue/user/${params.userId}/arts/digitized/${params.value}`
    +`?page=${params.page || '1'}&per_page=${params.per_page || '0'}`).pipe(
      map((response:any)=>{
        if(response){
          return response
        }
      })
    )
  }

  uploadArt(formData){
    return this.http.post(this.baseUrl + "v1/artqueue/arts/upload",formData).pipe(
      map((response: any) => {
        return response
      })
    );
  }

  getAllUserDepartments(){
    return this.http.get(this.baseUrl + "users/departments").pipe(
      map((response:any)=>{
        if(response){
          return response
        }
      })
    )
  }

  getTeamStoreColors() {  
    return this.http.get(this.baseUrl + "v1/color/store").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
      );
  }
  
}
