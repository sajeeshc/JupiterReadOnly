import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StoreManagerService {
  private baseUrl = environment.apiUrl + "v1/";

  constructor(private http: HttpClient) { }

  getProductCategory() {
    return this.http
      .get<any>(this.baseUrl + "products/categories", { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getProduct() {
    return this.http
      .get<any>(this.baseUrl + "products?orderby=date&order=desc", { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getDashboardDetailsCount() {
    return this.http
      .get<any>(this.baseUrl + "dashboard/user/0", { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getPendingOrderLIst(params?) {
    let url = this.baseUrl + "order/payments/pending?"
    if (params) {
      url += 'orderId=' + (params.orderId || 0)
      url += '&customerName=' + params.customerName
      url += '&institution=' + params.institution
      url += '&per_page=' + (params.per_page || 10)
      url += '&page=' + (params.page || 1)
    }
    return this.http
      .get<any>(url, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  approvePayment(orderId: any, status: any) {
    return this.http.put(this.baseUrl + "order/" + orderId + "/status/" + status, {}).pipe(
      map((response: any) => {
        const order = response;
        if (order) {
          return response;
        }
      })
    );
  }


  getOrderList(params) {
    if (params.orderId == '' || params.orderId == null)
      params.orderId = 0;
    return this.http
      .get<any>(environment.apiUrl + "v1/order/list?orderId=" + (params.orderId || '0') + "&customerName=" + (params.customerName || '')
        + "&institution=" + (params.institution || '') + "&customerEmail=" + (params.customerEmail || '') + "&customerPhone=" + (params.customerPhone || '') +
        "&startDate=" + (params.startDate || '') + "&endDate=" + (params.endDate || '') + "&orderType=" + (params.orderType || '0') + "&paymentMode=" + (params.paymentMode || '0') +
        "&per_page=" + (params.per_page || 0), { observe: "response" })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getOrderDetails(orderId: any) {
    return this.http
      .get<any>(environment.apiUrl + "v1/order/" + orderId + "/summary", { observe: "response" })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getOrder(orderId: any) {
    return this.http
      .get<any>(environment.apiUrl + "v1/order/" + orderId, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getOrderOutputStoresList(params) {
    let url = environment.apiUrl + 'v1/teamstore/orders/output?'
    url += "per_page=" + (params.per_page || '0')
    if (params.stage)
      url += "&stage=" + params.stage
    return this.http.get(url)
  }

  getOrderOutput(teamstoreId, herculesId, live?) {
    let url = environment.apiUrl + `v1/teamstore/${teamstoreId}/export/hercules/${herculesId}?liveStore=${live || 'false'}`
    return this.http.post(url, {})
  }

  updateHercIdWebForOrders(orderId, herculesId) {
    let url = environment.apiUrl + `v1/order/${orderId}/weborders/export/hercules/${herculesId}`
    return this.http.put(url, {})
  }

  getStoreOrderByStoreId(storeId) {
    return this.http.get(environment.apiUrl + "v1/teamstore/" + storeId + "/orders")
  }

  cancelProduct(id) {
    return this.http.put(environment.apiUrl + "v1/order/lineitem/" + id, {})
  }

  cancelProductPersonalization(data) {
    return this.http.post(environment.apiUrl + "v1/order/teamstore/personalization/refund/", data)
  }

  getAllManagerList() {
    return this.http.get(environment.apiUrl + "v1/teamstore/managers")
  }

  republishStore(storeId){
    return this.http.post(environment.apiUrl + "v1/teamstore/"+storeId+"/republish",{})
  }
}
