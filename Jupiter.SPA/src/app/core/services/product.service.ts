import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}v1/`;
  constructor(private http: HttpClient) { }

  getProductCategory() {
    return this.http
      .get<any>(this.baseUrl + "products/categories?per_page=0", { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getVendors() {
    return this.http
      .get<any>(this.baseUrl + "products/vendors?per_page=0", { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getProduct(params) {
    return this.http
      .get<any>(this.baseUrl +
        `products?orderby=${params.orderBy || 'id'}&order=${params.order || 'asc'}&page=${params.page || '1'}`+
        `&per_page=${params.per_page || '0'}&category=${params.categoryId || '0'} &viewType=${params.viewType || ''}`+
        `&storeStatuses=${params.storeStatuses || ''}&keyword=${params.keyword || ''}`,
        { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getProducts(params) {
    let url = this.baseUrl + `products/view/reduced?per_page=${params.per_page || 0}&feed=${params.feed || false}`
    if (params.filter) {
      url += '&colors=' + (params.filter.colors ? encodeURIComponent(params.filter.colors) : '')
      url += '&categories=' + (params.filter.categories ? encodeURIComponent(params.filter.categories) : '')
      url += '&sizes=' + (params.filter.sizes ? encodeURIComponent(params.filter.sizes) : '')
      url += '&brands=' + (params.filter.brands ? encodeURIComponent(params.filter.brands) : '')
      url += '&markets=' + (params.filter.markets ? encodeURIComponent(params.filter.markets) : '')
      url += '&storeStatus=' + (params.filter.storeStatus ? encodeURIComponent(params.filter.storeStatus) : '')
      url += '&styleName=' + (params.filter.styleName ? encodeURIComponent(params.filter.styleName) : '')
      url += '&vendorName=' + (params.filter.vendorName ? encodeURIComponent(params.filter.vendorName) : '')
      url += '&description=' + (params.filter.description ? encodeURIComponent(params.filter.description) : '')
      url += '&name=' + (params.filter.name ? encodeURIComponent(params.filter.name) : '')
      url += '&keyword=' + (params.filter.keyword ? encodeURIComponent(params.filter.keyword) : '')
      url += '&decoGroups=' + (params.filter.decoGroups ? encodeURIComponent(params.filter.decoGroups) : '')
      url += '&storeStatuses=' + (params.filter.storeStatuses ? encodeURIComponent(params.filter.storeStatuses) : '')
      if(params.filter.active != undefined && params.filter.active !=null)
        url += '&active=' + params.filter.active
      // url += '&vendorName=' + (params.filter.vendors || '')

      url +='&orderby=' + (params.filter.orderBy || 'id')
      url += '&order=' + (params.filter.order || 'asc')
      url += '&page=' + (params.page || '0')
      url += '&viewType=' + (params.filter.viewType || '')
    }
    return this.http
      .get<any>(url,
        { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getProductDetail(product: any = "") {
    return this.http
      .get<any>(this.baseUrl + "products/" + product, { observe: "response" })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  getProductDetailsById(productId, feed?) {
    return this.http
      .get<any>(this.baseUrl + "products/" + productId + "/data?feed=" + feed, { observe: "response" })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  getAllAvailableSizes() {
    return this.http
      .get<any>(this.baseUrl + "products/sizes", { observe: "response" })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  getAllProductGroups(params) {
    return this.http
      .get<any>(this.baseUrl + `products/groups?orderby=${params.orderBy || 'id'}&order=${params.order || 'desc'}&page=${params.page || '1'}&per_page=${params.per_page || '0'}`, { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  updateProductGroup(data) {
    return this.http
      .put(this.baseUrl + "products/group", data, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  removeProductGroup(groupId) {
    return this.http
      .delete(this.baseUrl + "products/group/" + groupId, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  updateProductService(data) {
    return this.http
      .put(this.baseUrl + "products/service", data, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  removeProductService(serviceId) {
    return this.http
      .delete(this.baseUrl + "products/service/" + serviceId, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  uploadImgFile(formData: FormData) {
    return this.http.post(this.baseUrl + "upload/file", formData).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getAllProductCategory(params) {
    return this.http
      .get<any>(this.baseUrl + `products/categories?orderby=${params.orderBy || 'date'}&order=${params.order || 'desc'}&page=${params.page || '1'}&per_page=${params.per_page || '0'}`, { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  updateProductCategory(data) {
    return this.http
      .put(this.baseUrl + "products/category", data, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  removeProductCategory(categoryId) {
    return this.http
      .delete(this.baseUrl + "products/category/" + categoryId, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  getAllProductMarginFormulas(params) {
    return this.http
      .get<any>(this.baseUrl + `products/margin/formulas?orderby=${params.orderBy || 'id'}&order=${params.order || 'desc'}&page=${params.page || '1'}&per_page=${params.per_page || '0'}`, { observe: "response" })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  updateProductMarginFormula(data) {
    return this.http
      .put(this.baseUrl + "products/margin/formula", data, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  removeProductMarginFormula(formulaId) {
    return this.http
      .delete(this.baseUrl + "products/margin/formula/" + formulaId, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  getAllProductLocations(params) {
    return this.http.get(this.baseUrl + `products/locations?orderby=${params.orderBy || 'id'}&order=${params.order || 'desc'}&page=${params.page || '1'}&per_page=${params.per_page || '0'}`, { observe: "response" }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  getAllItemTypes(params) {
    return this.http.get(this.baseUrl + `products/itemtypes?orderby=${params.orderBy || 'id'}&order=${params.order || 'desc'}&page=${params.page || '1'}&per_page=${params.per_page || '0'}`, { observe: "response" }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  getAlBox(params) {
    return this.http.get(this.baseUrl + `products/shipping/boxes?orderby=${params.orderBy || 'id'}&order=${params.order || 'desc'}&page=${params.page || '1'}&per_page=${params.per_page || '0'}`, { observe: "response" }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }
  
  deleteBox(id) {
    return this.http.delete(this.baseUrl + `products/shipping/box/${id}`, { observe: "response" }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }
  
  saveBox(data) {
    return this.http
      .put(this.baseUrl + "products/shipping/box", data, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  saveItemType(data) {
    return this.http
      .put(this.baseUrl + "products/itemtype", data, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  deleteItemType(id) {
    return this.http
      .delete(this.baseUrl + "products/itemtype/" + id, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  updateProductLocation(data) {
    return this.http
      .put(this.baseUrl + "products/location", data, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  removeProductLocation(locationId) {
    return this.http
      .delete(this.baseUrl + "products/location/" + locationId, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  updateProductData(product, feed?) {
    feed = feed || false
    return this.http
      .put(this.baseUrl + "products/data?feed=" + feed, product, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  addNewProductData(product) {
    return this.http
      .post(this.baseUrl + "products/data", product, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  getAllProductStatuses(params) {
    return this.http.get(this.baseUrl + `products/store/statuses?orderby=${params.orderBy || 'id'}&order=${params.order || 'desc'}&page=${params.page || '1'}&per_page=${params.per_page || '0'}`, { observe: "response" }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  getAllProductServices(params) {
    return this.http.get(this.baseUrl + `products/services?orderby=${params.orderBy || 'id'}&order=${params.order || 'desc'}&page=${params.page || '1'}&per_page=${params.per_page || '0'}`, { observe: "response" }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  bulkUpdateProductData(data, feed) {
    return this.http
      .put(this.baseUrl + "products/manage?feed=" + feed, data, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  updatePromotion(data) {
    return this.http
      .put(this.baseUrl + "products/promotion", data, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  getAllPromotions(params) {
    return this.http.get(this.baseUrl + `products/promotions?orderby=${params.orderBy || 'id'}&order=${params.order || 'desc'}&page=${params.page || '1'}&per_page=${params.per_page || '0'}`, { observe: "response" }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  getPromotion(id) {
    return this.http.get(this.baseUrl + `products/promotion/${id}`, { observe: "response" }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  deletePromotion(id) {
    return this.http.delete(this.baseUrl + `products/promotion/${id}`, { observe: "response" }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  getDecoGroup(id) {
    return this.http.get(this.baseUrl + `products/decogroups/${id}`, { observe: "response" }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  getAllDecoGroups(params) {
    return this.http.get(this.baseUrl + `products/decogroups?orderby=${params.orderBy || 'id'}&order=${params.order || 'desc'}&page=${params.page || '1'}&per_page=${params.per_page || '0'}`, { observe: "response" }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
      })
    );
  }

  updateDecoGroup(data) {
    return this.http
      .put(this.baseUrl + "products/decogroup", data, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  deleteDecoGroup(id) {
    return this.http
      .delete(this.baseUrl + "products/decogroup/" + id, { observe: "response" })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  uploadBulkSizeChart(data){
    return this.http.post(this.baseUrl + 'products/sizechart',data)
  }
}

