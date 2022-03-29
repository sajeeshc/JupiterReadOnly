import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoredetailsService {

  private baseUrl = environment.apiUrl + "v1/";
  constructor(private http: HttpClient) { }

  getStoreArtList (teamStoreId: number) {

    return this.http
      .get<any>(this.baseUrl + "teamstore/" + teamStoreId + "/arts")
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getStoreSpreadsheetList (teamStoreId: number) {
    return this.http
      .get<any>(this.baseUrl + "teamstore/" + teamStoreId + "/products?per_page=0")
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  updateStoreProductListing (id, model: any) {
    return this.http.put(this.baseUrl +'teamstore/'+ id + "/products/setstatus", model).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

  addArtLink (url: string, teamStoreId: number) {
    let formData: FormData = new FormData();
    formData.append('artSrc', url);
    return this.http.post(this.baseUrl + "teamstore/" + teamStoreId + "/art", formData).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  updateStoreName (model: any) {
    return this.http.put(this.baseUrl + "teamstore", model).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

  updateStoreContactInfo (model: any, teamStoreId: number) {
    return this.http.put(this.baseUrl + "teamstore/" + teamStoreId + "/contact", model).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

  updateStoreDisplaySettings (model: any, teamStoreId: number) {
    return this.http.put(this.baseUrl + "teamstore/" + teamStoreId + "/productdisplaysettings", model).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

  updateStorePickUpMethods (model: any, teamStoreId: number) {
    return this.http.put(this.baseUrl + "teamstore/" + teamStoreId + "/pickupmethods", model).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

  updateStoreBrandings (formData: FormData, teamStoreId: number) {
    return this.http.put(this.baseUrl + "teamstore/" + teamStoreId + "/branding", formData).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

  uploadImage (formData: FormData) {
    return this.http.post(this.baseUrl + "upload/file", formData).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getLayoutSettings (teamStoreId: number) {
    return this.http
      .get<any>(this.baseUrl + "layout/teamstore/" + teamStoreId)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  updateLayoutSettings (data, teamStoreId: number) {
    return this.http.put(this.baseUrl + "layout/teamstore/" + teamStoreId, data).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

}
