import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class StorebuilderService {
  private baseUrl = environment.apiUrl + "v1/";

  constructor(private http: HttpClient) { }

  getStoreRequestList(filterParams,closeDateExceeded = false) {
    // ,name?, openDate?, closeDate?, orderBy?, order?, type?, assignedTo?, managerId?
    let params = new HttpParams();
    params = params.append("name", filterParams.name || '');
    params = params.append("id", filterParams.storeId || 0);
    params = params.append("contactName", filterParams.contactName || '');
    params = params.append("isUserVerified", filterParams.isUserVerified || '');
    params = params.append('orderBy', filterParams.orderBy || '');
    params = params.append('order', filterParams.order || '');
    params = params.append('assignedTo', filterParams.assignedTo || 0);
    params = params.append('accountManagerId', filterParams.accountManagerId || '');
    params = params.append('types', filterParams.type ? filterParams.type.toString() : '');
    params = params.append('closeDateFrom', filterParams.closeDateFrom || '');
    params = params.append('closeDateTo', filterParams.closeDateTo || '');
    params = params.append('per_page', filterParams.per_page || 0);
    params = params.append('page', filterParams.page || 1);
    if(filterParams.ownerId)
      params = params.append('ownerId', filterParams.ownerId || '');
    


    return this.http
      .get<any>(this.baseUrl + "teamstore?closeDateExceeded="+closeDateExceeded, { observe: "response", params })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getTeamStore(id: number) {
    return this.http.get<any>(this.baseUrl + "teamstore/" + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updatePrivacySettings(id: number, model: any) {
    return this.http.put(this.baseUrl + "teamstore/" + id + "/privacy", model).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateSocialMedia(id: number, model: any) {
    return this.http.put(this.baseUrl + "teamstore/" + id + "/socialmedia", model).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getDashboardDetailsCount(userId: number) {
    return this.http.get(this.baseUrl + "dashboard/user/" + userId).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getAssignedRequests(assignedToId: number, stage: any) {
    return this.http.get<any>(this.baseUrl + "teamstore/assignee/" + assignedToId + "/stage/" + stage + "?per_page=0&orderBy=date&order=desc").pipe(
      map((response) => {
        return response;
      })
    );
  }


  assignTeamstoreToMe(teamstoreId: number) {
    return this.http.put(this.baseUrl + "teamstore/" + teamstoreId + "/assign", {}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

}
