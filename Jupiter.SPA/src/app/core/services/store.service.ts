import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getEmailTemplateOrderReceipt(teamStoreId) {
    return this.http.get(this.baseUrl + "v1/teamstore/" + teamStoreId + "/purchase/email/template").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getDisclaimerTemplate(teamStoreId) {
    return this.http.get(this.baseUrl + "v1/teamstore/" + teamStoreId + "/disclaimer").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getEmailTemplateStoreLive(teamStoreId) {
    return this.http.get(this.baseUrl + "v1/teamstore/" + teamStoreId + "/live/email/template").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }
  getEmailTemplateStoreVerification(teamStoreId) {
    return this.http.get(this.baseUrl + "v1/teamstore/" + teamStoreId + "/publish/email/template").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  updateEmailTemplateOrderReceipt(teamStoreId, data) {
    return this.http.post(this.baseUrl + "v1/teamstore/" + teamStoreId + "/purchase/email/template", data).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }
  
  updateDisclaimerTemplate(data) {
    return this.http.put(this.baseUrl + "v1/teamstore/disclaimer", data).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }
  updateEmailTemplateStoreLive(teamStoreId, data) {
    return this.http.post(this.baseUrl + "v1/teamstore/" + teamStoreId + "/live/email/template", data).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }
  updateEmailTemplateStoreVerification(teamStoreId, data) {
    return this.http.post(this.baseUrl + "v1/teamstore/" + teamStoreId + "/publish/email/template", data).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  createStore(model: any) {
    return this.http.post(this.baseUrl + "v1/teamstore", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }


  copyStoreLayout(teamStoreId: any) {
    var token = localStorage.getItem("userToken");
    let header = new HttpHeaders().set(
      "Authorization",
      'Bearer ' + token
    );
    return this.http.post(this.baseUrl + "v1/teamstore/" + teamStoreId + "/copy", {}, { headers: header }).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  updateStore(model: any) {
    return this.http.put(this.baseUrl + "v1/teamstore", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  updateStoreCloseDate(model: any) {
    return this.http.put(this.baseUrl + "v1/teamstore/closure/edit", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  updateStoreNotifications(model: any, teamStoreId: number) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + teamStoreId + "/notifications", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  updateCustomCheckoutFields(model: any, teamStoreId: number) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + teamStoreId + "/customfields", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getStore(teamStoreId: number) {
    return this.http.get(this.baseUrl + "v1/teamstore/" + teamStoreId).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getProductDetails(teamStoreId: number, productId: number, mapCode) {
    return this.http.get(this.baseUrl + "v1/shoppingcart/store/" + teamStoreId + "/product/" + productId + "/detail/"+mapCode).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getDirectProductDetail(productId: number, typeId: number) {
    return this.http.get(this.baseUrl + "v1/shoppingcart/store/product/" + productId + "/designed/detail/" + typeId).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getCartDetails(cartId: number) {
    return this.http.get(this.baseUrl + "v1/shoppingcart/" + cartId).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  updateStoreCommission(model: any, teamStoreId: number) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + teamStoreId + "/storecommission", model).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

  updateStoreClosedPage(model: any, teamStoreId: number) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + teamStoreId + "/closedpage", model).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

  getShippingMethods() {
    return this.http.get<any>(this.baseUrl + "v1/teamstore/shippingmethods").pipe(
      map((response) => {
        return response;
      })
    );
  }

  getShippingAndPickUpMethods(teamstoreId?) {
    let url = this.baseUrl + "v1/teamstore/order/shippingmethods"
    if(teamstoreId) url = url + "?teamstoreId="+teamstoreId
    return this.http.get<any>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateShippingMethod(data){
    return this.http.put(this.baseUrl + "v1/teamstore/order/shippingmethods",data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getStoreShippingMethods(storeId) {
    return this.http.get<any>(this.baseUrl + "v1/teamstore/"+storeId+"/order/shippingmethods").pipe(
      map((response) => {
        return response;
      })
    );
  }

  saveStoreShippingMethods(storeId,body){
    return this.http.post<any>(this.baseUrl + "v1/teamstore/"+storeId+"/order/shippingmethods",body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getStoreTemplates(type: string) {
    return this.http.get<any>(this.baseUrl + "v1/teamstore/suggestedtemplate/suggestedstorelist?Types=" + type).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updatePrivacySettings(id: number, model: any) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + id + "/privacy", model).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateCheckoutSettings(model: any, teamStoreId: number) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + teamStoreId + "/checkoutsettings", model).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

  updateSocialMedia(id: number, model: any) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + id + "/socialmedia", model).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateSeoSettings(model: any, teamStoreId: number) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + teamStoreId + "/seosettings", model).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

  updateShippingMethods(id: number, model: any) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + id + "/shippingmethods", model).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateDeveloperSettings(model: any, teamStoreId: number, file: File, fileStatus: number) {
    var settingsJson = JSON.stringify(model);
    var formData = new FormData();
    formData.append('developerSettingsJson', settingsJson);
    formData.append('cssFile', file);
    formData.append('fileStatus', stringify(fileStatus));
    return this.http.put(this.baseUrl + "v1/teamstore/" + teamStoreId + "/developersettings", formData).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

  updateDomainSettings(model: any, teamStoreId: number) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + teamStoreId + "/domain", model).pipe(
      map((response: any) => {
        const result = response;
        if (result) {
          return response;
        }
      })
    );
  }

  updateProductionSchedule(id: number, model: any) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + id + "/designerproductionschedule", model).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateStorePolicies(model: any, teamStoreId: number) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + teamStoreId + "/policy", model).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateDesignerDisplaySettings(id: number, model: any) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + id + "/designerdisplaysettings", model).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getProductCategories(teamStoreId) {
    return this.http.get<any>(this.baseUrl + "v1/teamstore/productcategories/" + teamStoreId).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getCategoriesWithProducts(teamStoreId) {
    return this.http.get<any>(this.baseUrl + "v1/teamstore/categoryproducts/" + teamStoreId).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createProductCategory(model: any, teamStoreId) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + teamStoreId + "/productCategory", model).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateProductCategory(model: any, teamStoreId) {
    return this.http.put(this.baseUrl + "v1/teamstore/" + teamStoreId + "/categoryproducts", model).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteCategory(categoryId: number) {
    return this.http.delete(this.baseUrl + "v1/teamstore/productcategory/" + categoryId).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateStoreStatus(teamStoreId, stageType, data?) {
    data = data == null ? {} : data;
    return this.http.put(this.baseUrl + "v1/teamstore/" + teamStoreId + "/stage/" + stageType, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  addToCart(product: any) {
    return this.http.post(this.baseUrl + "v1/shoppingcart", product).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  addToCartBulk(products: any, type = 2) {
    return this.http.post(this.baseUrl + "v1/shoppingcart/bulk/" + type, products).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getBulkOrderEntries(params) {
    let url = this.baseUrl + "v1/shoppingcart/bulk/orders?"
    for (let key in params) {
      url += (key + "=" + params[key] + "&")
    }
    return this.http.get(url).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getBulkOrderEntryByRefId(refId) {
    return this.http.get(this.baseUrl + "v1/shoppingcart/bulk/order/" + refId).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getCartList() {
    return this.http.get(this.baseUrl + "v1/shoppingcart").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  deleteProductFromCart(id: any) {
    return this.http.delete(this.baseUrl + "v1/shoppingcart/" + id).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  checkout(model: any) {
    return this.http.post(this.baseUrl + "v1/order", model).pipe(
      map((response: any) => {
        const order = response;
        if (order) {
          return response;
        }
      })
    );
  }

  getAvailableStoreColors() {
    return this.http.get(this.baseUrl + "v1/color").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getAvailableInkColors(params?) {
    let url = this.baseUrl + "v1/color/ink/service/mappings?"
    if(params){
      url += 'internal=' + params.internal + '&'
    }
    return this.http.get(url).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getAvailableStoreFonts() {
    return this.http.get(this.baseUrl + "v1/font").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getPersonalizationTypes() {
    return this.http.get(this.baseUrl + "/v1/products/personalization/types").pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  getAvailableStoreServices() {
    return this.http.get(this.baseUrl + "v1/service").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getAvailableProductSizes() {
    return this.http.get(this.baseUrl + "v1/products/designsizes").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getAvailableStoreProductPositions(productId: any) {
    return this.http.get(this.baseUrl + "v1/products/customize/positions/" + productId).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getProductColors(productId: any) {
    return this.http.get(this.baseUrl + "v1/products/" + productId + "/colors").pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  getProductLocations(productId: any) {
    return this.http.get(this.baseUrl + "v1/products/" + productId + "/locations").pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  getDecoPricing(serviceId: any, colorCount: any, positionId: any, index: any) {
    return this.http.get(this.baseUrl + "v1/products/service/" + serviceId + "/color/count/" + colorCount + "/position/" + positionId + "/index/" + index).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  getFilteredProductList(teamStoreId: any, name?: string) {
    return this.http
      .get<any>(this.baseUrl + "v1/teamstore/" + teamStoreId + "/products?Name=" + name, { observe: "response" })
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            return response;
          }
        })
      );
  }


  //artgetRejectedArtList

  getArtList(params) {
    // getArtList(startDate?, endDate?, type?, artist?, artType?, serviceId?) {
    if (params.artType == "") {
      params.artType = 0;
    }

    return this.http.get(this.baseUrl + "v1/artqueue"
      + "?type=" + params.type
      + "&per_page=" + (params.per_page || 10)
      + "&startDate=" + (params.startDate || '')
      + "&endDate=" + (params.endDate || '')
      + "&artist=" + (params.artist || '')
      + "&artType=" + (params.artType || 0)
      + "&serviceId=" + (params.serviceId || 0)
    ).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getRejectedArtList(type?, startDate?, endDate?) {

    return this.http.get(this.baseUrl + "v1/artqueue/orderarts/rejected?Type=" + type + "&startDate=" + startDate + "&endDate=" + endDate).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getArtists() {
    return this.http.get(this.baseUrl + "users/artists").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getArtImgList(id: any, artId?) {
    return this.http.get(this.baseUrl + "v1/artqueue/" + id + "/arts?artId=" + artId).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getArtDesignImagesForVerification(file: string[]) {
    return this.http.get(this.baseUrl + "v1/products/designed/" + file).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getUserArtVerificationDetails(artQueueId, artId, ids, orderId) {
    return this.http.get(this.baseUrl + "v1/products/artqueue/" + artQueueId + "/art/" + artId + "/designed/" + ids + "/order/" + orderId).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  uploadImgFile(formData: FormData, mappingId: any) {
    return this.http.post(this.baseUrl + "v1/artqueue/mapping/" + mappingId + "/art/upload", formData).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateArtQueueStatus(data) {
    return this.http.put(this.baseUrl + "v1/artqueue", data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateArtQueueStatusWithImg(data) {
    return this.http.put(this.baseUrl + "v1/artqueue/mappings", data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updatePdfDownloadStatus(artMappingId) {
    return this.http.put(this.baseUrl + "v1/artqueue/orderart/mapping/" + artMappingId + "/download", {}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateVinylDownloadStatus(orderId) {
    return this.http.put(this.baseUrl + "v1/artqueue/order/" + orderId + "/download", {}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getOrderArtPdf(orderId) {
    return this.http.get(this.baseUrl + "v1/order/" + orderId + "/download/pdf").pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteSelectedProductsFromCart(ids: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: ids
    };

    return this.http.delete(this.baseUrl + "v1/shoppingcart/items", httpOptions).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getClientAuth() {
    return this.http.post(this.baseUrl + "v1/paymentgateway/token/generate", {}).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  createOrder(formData) {
    return this.http.post(this.baseUrl + "v1/paymentgateway/transaction/order/create/v1", formData).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getAllLocations() {
    return this.http.get(this.baseUrl + "v1/position/all").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  userVerifyTeamStore(storeId, status, rejectionBody) {
    return this.http.post(this.baseUrl + "v1/teamstore/" + storeId + "/userverify/" + status, rejectionBody).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  userVerifyArtQueue(artQueueId, artId, status, data) {
    return this.http.post(this.baseUrl + "v1/artqueue/" + artQueueId + "/art/" + artId + "/userverify/" + status, { data }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  getProducts(params) {
    return this.http.get(this.baseUrl + `v1/products?featured=${params.featured || false}
    &per_page=${params.per_page || 0}&viewType=${params.viewType || ''}`).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  uploadArt(formData: FormData) {
    return this.http.post(this.baseUrl + "v1/upload/file", formData).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  uploadPdfArt(formData: FormData) {
    return this.http.post(this.baseUrl + "v1/service/pdf/convert/jpg", formData).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getReasonList() {
    return this.http.get(this.baseUrl + "v1/artqueue/art/reasons").pipe(
      map((response: any) => {
        const reasonList = response;
        if (reasonList) {
          return response;
        }
      })
    );
  }

  getCustomerReasonList() {
    return this.http.get(this.baseUrl + "v1/artqueue/art/customer/reasons").pipe(
      map((response: any) => {
        const reasonList = response;
        if (reasonList) {
          return response;
        }
      })
    );
  }

  getOrderArtDetails(orderArtId) {
    return this.http.get(this.baseUrl + "v1/order/arts/" + orderArtId).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  getOrderArtList(startDate?, endDate?, type?, artist?, artType?, service?, keyword?, orderArtType?, customer?, orderId?) {
    if (artType == "") {
      artType = 0;
    }

    return this.http.get(this.baseUrl + "v1/artqueue/orderarts?serviceId=" +
      service + "&startDate=" + startDate + "&endDate=" + endDate + "&keyword=" + keyword + "&artType=" + orderArtType + "&customer=" + customer + "&orderId=" + orderId).pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            return response;
          }
        })
      );
  }

  getOrderArtListV2(stage?, startDate?, endDate?, type?, artist?, artType?, service?, keyword?, customer?, orderId?) {
    if (artType == "") {
      artType = 0;
    }

    return this.http.get(this.baseUrl + "v1/artqueue/orderarts/v1?stage=" + stage + "&serviceId="
      + service + "&startDate=" + startDate + "&endDate=" + endDate + "&keyword=" + keyword + "&artType=" + artType + "&customer=" + customer + "&orderId=" + orderId).pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            return response;
          }
        })
      );
  }

  getTeamStoreRejectionCodes() {
    return this.http.get<any>(this.baseUrl + "v1/teamstore/rejection/codes").pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  reAssignArtOrTeamStore(itemId, type) {
    return this.http.put(this.baseUrl + "v1/teamstore/entity/" + itemId + "/assign/" + type, {}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  validateStoreUrl(endPoint, teamstoreId){
    return this.http.post(this.baseUrl + "v1/teamstore/url/validate", {endPoint,teamstoreId}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  resubmitDiscount(teamStoreId, data) {
    return this.http.put(this.baseUrl + "v1/teamstore/"+teamStoreId+"/garment/discount", data).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }
}
