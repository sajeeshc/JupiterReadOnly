import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FinanceManagerService {


  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getCreditApplications(params) {
    let url = this.baseUrl + "users/credits?"
    url += 'customerName=' + params.customerName
    url += '&customerEmail=' + params.customerEmail
    url += '&organization=' + params.organization
    url += '&creditStatus=' + params.creditStatus
    url += '&per_page=' + (params.per_page || 10)
    url += '&page=' + (params.page || 1)
    return this.http
      .get<any>(url, { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getFinancialReport(params) {
    let url = this.baseUrl + "v1/order/report/financial?"
    url += 'startDate=' + params.startDate
    url += '&endDate=' + params.endDate
    url += '&per_page=' + (params.per_page || 10)
    url += '&page=' + (params.page || 1)
    return this.http
      .get<any>(url, { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getCreditApplicationHistory(id) {
    return this.http
      .get<any>(this.baseUrl + "users/credits/" + id, { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  
  getShippingChargeUpdateRequests() {
    return this.http
      .get<any>(this.baseUrl + "v1/teamstore/shipping/individual/queue", { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  updateShippingChargeRequestStatus(data) {
    let url = this.baseUrl + "v1/teamstore/"+data.teamStoreId+"/shipping/individual/queue"
    return this.http.put(url, data)
  }

  getPendingDiscountApplications(params) {
    let url = this.baseUrl + "v1/order/discount/pending?"
    url += "customerName=" + (params.customerName || '')
    url += "&customerEmail=" + (params.customerEmail || '')
    url += "&organization=" + (params.organization || '')
    url += "&productId=" + (params.productId || '')
    url += "&productName=" + (params.productName || '')
    url += "&referenceId=" + (params.referenceId || '')
    url += "&page=" + (params.page || '')
    url += "&per_page=" + (params.per_page || '')
    return this.http
      .get<any>(url,
        { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  updateDiscountApplication(data) {
    let url = this.baseUrl + "v1/order/discount/pending"
    return this.http.put(url, data)
  }

  getPendingStoreDiscountApplications(params) {
    let url = this.baseUrl + "v1/teamstore/garment/discount/pending?"
    url += "accountManagerName=" + (params.accountManagerName || '')
    url += "&teamStoreId=" + (params.teamStoreId || '')
    url += "&teamStoreName=" + (params.teamStoreName || '')
    url += "&customerName=" + (params.customerName || '')
    url += "&emailId=" + (params.emailId || '')
    url += "&page=" + (params.page || '')
    url += "&per_page=" + (params.per_page || '')
    return this.http
      .get<any>(url,
        { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getDiscountApplicationByStoreId(id) {
    let url = this.baseUrl + "v1/teamstore/" + id + "/garment/discount/pending"
    return this.http.get(url)
  }

  updateStoreDiscountStatus(data) {
    let url = this.baseUrl + "v1/teamstore/garment/discount/pending"
    return this.http.put(url, data)
  }

  getCancelledSummery(params) {
    let url = this.baseUrl + "v1/order/teamstore/personalization/refund/details?"
    url += "storeId=" + (params.storeId || '')
    url += "&storeName=" + (params.storeName || '')
    url += "&orderId=" + (params.orderId || '')
    url += "&customerName=" + (params.customerName || '')
    url += "&customerEmail=" + (params.customerEmail || '')
    url += "&storeCloseDate=" + (params.storeCloseDate || '')
    url += "&page=" + (params.page || '')
    url += "&per_page=" + (params.per_page || '')
    return this.http
      .get<any>(url,
        { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
