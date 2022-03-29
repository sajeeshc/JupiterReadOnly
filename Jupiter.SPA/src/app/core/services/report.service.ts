import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient,
  ) { }

  apiUrl = environment.apiUrl

  getStoreProductReport(storeId, mapCode){
    return this.http.get(this.apiUrl + 'v1/teamstore/'+storeId+'/product/'+mapCode+'/report')
  }

  getStoreOrderReport(storeId){
    return this.http.get(this.apiUrl + 'v1/teamstore/'+storeId+'/orders/report')
  }

  getOrderReportWithStoreInfo(orderId){
    return this.http.get(this.apiUrl + 'v1/teamstore/orders/'+orderId+'/report')
  }

  getSlowMovingProductReport(storeId){
    return this.http.get(this.apiUrl + 'v1/teamstore/'+storeId+'/items/minimum/report')
  }
}
