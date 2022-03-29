import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  private baseUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
  ) { }

  getAllStates() {
    return this.http.get(this.baseUrl + "v1/state/all").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getInstituitionTypes () {
    return this.http.get<any>(this.baseUrl + "users/institution/types").pipe(
      map((response) => {
        return response;
      })
    );
  }

  getMarketGroups () {
    return this.http.get<any>(this.baseUrl + "users/marketgroups").pipe(
      map((response) => {
        return response;
      })
    );
  }

  getMarkets (marketGroupId:number) {
    return this.http.get<any>(this.baseUrl + "users/marketgroups/"+marketGroupId).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getMarketAndGroups () {
    return this.http.get<any>(this.baseUrl + "users/marketandgroups").pipe(
      map((response) => {
        return response;
      })
    );
  }

  getTax(data){
    return this.http.post<any>(this.baseUrl + "v1/order/tax", data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getAllServiceWithPrice(){
    return this.http.get(this.baseUrl + 'v1/products/decoprice/categorized').pipe(
      map((response) => {
        return response;
      })
    );
  }

  getShippingMethods(){
    return this.http.get(this.baseUrl + 'v1/service/shipping/servicecodes').pipe(
      map((response) => {
        return response;
      })
    );
  }

  getShippingCharge(serviceCode, data){
    return this.http.post<any>(this.baseUrl + "v1/order/shipping/"+serviceCode+"/charge", data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  validateAddress(data){
    return this.http.post<any>(this.baseUrl + "v1/service/address/validate", data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getPersonalizationServices(params?){
    let url = this.baseUrl + '/v1/products/personalization/types/v1.01?'
    if(params){
      url += 'internal='+(params.internal || false)
    }
    return this.http.get(url)
  }

  getDecoPriceByProperties(data){
    return this.http.post<any>(this.baseUrl + "v1/products/decoprice/v1.0", data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getStoreDecoPrice(data){
    return this.http.post<any>(this.baseUrl + "v1/teamstore/decoprice/v1.0", data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
