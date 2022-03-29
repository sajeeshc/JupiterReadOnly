import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private productService: ProductService,
  ) { }

  productList = []
  paginator = {
    length: 0,
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    pageIndex: 1,
  }
  filterParams = {
    minPrice: 0,
    maxPrice: 500,
    name: '',
    styleName: '',
    colors: [],
    categories: [],
    sizes: [],
    brands: [],
    vendorName: [],
    filterText: ''
  }
  categoryList: any[] = [];
  vendorList = []
  ngOnInit() {
    // let previousPagination = localStorage.getItem('productSelectionPagination')
    // console.log(previousPagination)
    // if(previousPagination){
    //   this.paginator = JSON.parse(previousPagination)
    //   localStorage.removeItem('productSelectionPagination')
    // }
    this.commonService.setPageHeader("Product Selection")
    this.getProducts()
    this.getProductCategories()
    this.getVendorList()
  }

  getVendorList() {
    this.productService.getVendors().subscribe(res => {
      this.vendorList = res.body.data
    })
  }

  getProductCategories() {
    this.productService.getProductCategory().subscribe(
      (response) => {
        this.categoryList = response.body.data;
      }
    );
  }

  pageEvent(event) {
    this.paginator.pageSize = event.pageSize
    this.paginator.pageIndex = event.pageIndex + 1
    this.getProducts();
  }

  getProducts() {
    const filter: any = this.formatFilterParams()
    const params = {
      per_page: this.paginator.pageSize,
      page: this.paginator.pageIndex,
      filter
    }
    this.productService.getProducts(params).subscribe(
      (response) => {
        this.productList = response.body.data;
        this.paginator.length = JSON.parse(response.headers.get("Pagination")).totalItems || 0
      },
    );
  }

  formatFilterParams() {
    let formattedParams = {
      name: this.filterParams.filterText, 
      styleName: this.filterParams.styleName
    }
    let tempStr = ''
    tempStr = JSON.stringify(this.filterParams.colors)
    tempStr = tempStr.substr(1, tempStr.length - 2)
    formattedParams["colors"] = tempStr
    tempStr = JSON.stringify(this.filterParams.categories)
    tempStr = tempStr.substr(1, tempStr.length - 2)
    formattedParams["categories"] = tempStr
    tempStr = JSON.stringify(this.filterParams.sizes)
    tempStr = tempStr.substr(1, tempStr.length - 2)
    formattedParams["sizes"] = tempStr
    tempStr = JSON.stringify(this.filterParams.brands)
    tempStr = tempStr.substr(1, tempStr.length - 2)
    formattedParams["brands"] = tempStr
    formattedParams["vendorName"] = this.filterParams.vendorName.toString()
    return formattedParams
  }

  clearFilter() {
    this.filterParams = {
      minPrice: 0,
      maxPrice: 500,
      name: '',
      styleName:'',
      colors: [],
      categories: [],
      sizes: [],
      brands: [],
      vendorName: [],
      filterText: ''
    }
    this.getProducts()
  }
}
