import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';

import { Options, LabelType } from "@angular-slider/ngx-slider";
import Swal from 'sweetalert2'
import { StoreService } from 'src/app/core/services/store.service';
declare var $: any

@Component({
  selector: 'app-set-category',
  templateUrl: './set-category.component.html',
  styleUrls: ['./set-category.component.scss']
})
export class SetCategoryComponent implements OnInit {

 
  constructor(
    private productService: ProductService,
    private commonService: CommonService,
    private router: Router,
    private storeService: StoreService
  ) { }  
  productsLoading = false
  decoGroupList = []
  
  selectedProducts = []
  decoGroupId = ''

  checkedProducts = []
  checkedProductsSelected = []
  checkAllUncategorized = false
  checkAllSelected = false
  selectAll_1 = false
  selectAll_2 = false

  filteredProductList = []
  selectedFilteredProductList = []
  filterText = ''
  filterSelectedText = ''
  isFeed = false

  
  ngOnInit() {
    this.commonService.setPageHeader("Assign Category To Product")
    this.getProductList()
    this.getDecoGroups()
  }

  getProductList() {
    this.productsLoading = true
    const feed = this.isFeed
    const filter = {categories:-1}
    this.productService.getProducts({ per_page: 0, feed, filter }).subscribe(
      (response) => {
        // this.productList = response.body.data;
        this.filteredProductList = response.body.data;
        this.productsLoading = false
        // this.filterUncategorized()
      },
      (error) => {
        this.productsLoading = false
      }
    );
  }
  
  getDecoGroups() {
    this.productService.getAllDecoGroups({}).subscribe(
      (response) => {
        this.decoGroupList = response.body.data;
      },
      (error) => {
      }
    );
  }
  
  setChecked(event, product, type) {
    if (type === 0) {
      if (event.checked)
        this.checkedProducts.push(product)
      else {
        this.checkedProducts = this.checkedProducts.filter(p => { return p.id != product.id })
        this.selectAll_1 = false
      }
    } else {
      if (event.checked)
        this.checkedProductsSelected.push(product)
      else {
        this.checkedProductsSelected = this.checkedProductsSelected.filter(p => { return p.id != product.id })
        this.selectAll_2 = false
      }
    }
  }

  checkAll(event, type, stop?) {
    if (type == 1) {
      if (event.checked) {
        this.checkAllUncategorized = true
        this.checkedProducts = [...this.filteredProductList]
      } else {
        this.checkAllUncategorized = false
        this.checkedProducts = []
      }
    } else {
      if (event.checked) {
        this.checkAllSelected = true
        this.checkedProductsSelected = [...this.selectedFilteredProductList]
      } else {
        this.checkAllSelected = false
        this.checkedProductsSelected = []
      }
    }
  }

  addProducts() {
    this.checkedProducts.forEach(product => {
      this.selectedProducts.push(product)
    })
    // this.productList = this.productList.filter(product => {
    //   return this.checkedProducts.includes(product) == false
    // })
    this.filteredProductList = this.filteredProductList.filter(product => {
      return this.checkedProducts.includes(product) == false
    })
    this.checkedProducts = []
    this.filterSelected()
    // this.filterUncategorized()
  }

  removeProducts() {
    this.checkedProductsSelected.forEach(product => {
      this.filteredProductList.push(product)
      // this.productList.push(product)
    })
    this.selectedProducts = this.selectedProducts.filter(product => {
      return this.checkedProductsSelected.includes(product) == false
    })
    this.checkedProductsSelected = []
    // this.filterUncategorized()
    this.filterSelected()
  }

  filterSelected() {
    this.selectedFilteredProductList = this.selectedProducts.filter(product => {
      return (product.id + " - " + product.name).toLowerCase().indexOf(this.filterSelectedText.toLowerCase()) >= 0
    })
  }

  
  submit() {
    const feed = this.isFeed
    const ids = this.selectedProducts.map(product => { return product.id })
    let formData = new FormData()
    const json = {
      decoGroupId: this.decoGroupId || 0,
      
    }
    formData.append('productIds', ids.toString())
    formData.append('json', JSON.stringify(json))
    if (ids.toString().length) {
      this.productService.bulkUpdateProductData(formData, feed).subscribe(res => {
        this.commonService.openSuccessSnackBar("Product categories and attributes saved successfully", "")
        this.router.navigateByUrl('/productmanager/dashboard')
      })
    }else{
      this.commonService.openErrorSnackBar("Select products to apply attributes","")
    }
  }

  attributeDisplay(attribute1, attribute2) {
    if (attribute1 && attribute2) {
      if (attribute1.id == attribute2.id) {
        return attribute1.name;
      }
    }
    return "";
  }

  onDataSourceChange() {
    Swal.fire({
      html: '<h5>Do you want to change data source</h5>',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetData()
        this.getProductList()
      } else {
        this.isFeed = !this.isFeed
      }
    })
  }

  resetData() {
    // this.productList = []
    this.selectedProducts = []
    this.checkedProducts = []
    this.checkedProductsSelected = []
    this.checkAllUncategorized = false
    this.checkAllSelected = false
    this.selectAll_1 = false
    this.selectAll_2 = false
    // this.filteredProductList = []
    this.selectedFilteredProductList = []
    this.filterText = ''
    this.filterSelectedText = ''
  }
}
