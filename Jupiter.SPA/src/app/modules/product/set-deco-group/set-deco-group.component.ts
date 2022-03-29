import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import { StoreService } from 'src/app/core/services/store.service';

import Swal from 'sweetalert2'
declare var $: any

@Component({
  selector: 'app-set-deco-group',
  templateUrl: './set-deco-group.component.html',
  styleUrls: ['./set-deco-group.component.scss']
})
export class SetDecoGroupComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private commonService: CommonService,
    private router: Router,
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

  categoryList = []
  filterParams = {
    categories: []
  }
  filteredProductList = []
  selectedFilteredProductList = []
  filterText = ''
  filterSelectedText = ''
  isFeed = false
  preventDoubleTap = false
  ngOnInit() {
    this.commonService.setPageHeader("Assign Deco Group To Products")
    this.getProductList()
    this.getDecoGroups()
    this.getProductCategories()
    $(document).mouseup(function (e) {
      let container = $("#filter");
      let matPanel = $(".mat-select-panel")
      let backdrop = $(".cdk-overlay-backdrop")
      let filterButton = $(".filter-btn")[0]
      if (filterButton == e.target) {
        if(!this.preventDoubleTap){
          $("#filter").toggle("slow")
          this.preventDoubleTap = true
        }
        setTimeout(()=>{
          this.preventDoubleTap = false
        },500)
      } else if (!container.is(e.target) && container.has(e.target).length === 0) {
        if (!matPanel.is(e.target) && matPanel.has(e.target).length === 0) {
          if (!backdrop.is(e.target) && backdrop.has(e.target).length === 0) {
            if(!this.preventDoubleTap){
              $("#filter").fadeOut("slow");
              this.preventDoubleTap = true
            }
            setTimeout(()=>{
              this.preventDoubleTap = false
            },500)
          }
        }
      }

    });
  }

  getProductList() {
    this.hideFilter()
    this.productsLoading = true
    const feed = this.isFeed
    const filter = { decoGroups: -1, name: this.filterText, categories: this.filterParams.categories.toString() }
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
    if (!ids.toString().length) {
      this.commonService.openErrorSnackBar("Select products to apply attributes", "")
      return
    }
    if (!this.decoGroupId) {
      this.commonService.openErrorSnackBar("Select deco group to continue", "")
      return
    }
    let formData = new FormData()
    const json = {
      decoGroupId: this.decoGroupId || 0,
    }
    formData.append('productIds', ids.toString())
    formData.append('json', JSON.stringify(json))
    this.productService.bulkUpdateProductData(formData, feed).subscribe(res => {
      this.commonService.openSuccessSnackBar("Product deco group saved successfully", "")
      this.router.navigateByUrl('/productmanager/dashboard')
    })
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

  getProductCategories() {
    this.productService.getProductCategory().subscribe(
      (response) => {
        this.categoryList = response.body.data;
      },
      (error) => {

      }
    );
  }

  hideFilter() {
    $("#filter").fadeOut("slow");
  }

  resetFilter() {
    this.filterParams.categories = []
  }
}
