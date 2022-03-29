import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import { StoreService } from 'src/app/core/services/store.service';

import Swal from 'sweetalert2'
declare var $: any


@Component({
  selector: 'app-bulk-size-chart',
  templateUrl: './bulk-size-chart.component.html',
  styleUrls: ['./bulk-size-chart.component.scss']
})
export class BulkSizeChartComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private commonService: CommonService,
    private router: Router,
    private storeService: StoreService,
  ) { }

  productsLoading = false

  selectedProducts = []
  decoGroupId = ''

  checkedProducts = []
  checkedProductsSelected = []
  checkAllUncategorized = false
  checkAllSelected = false
  selectAll_1 = false
  selectAll_2 = false

  categoryList = []
  vendorList = []
  filterParams = {
    categories: [],
    vendorName: []
  }
  filteredProductList = []
  selectedFilteredProductList = []
  filterText = ''
  filterSelectedText = ''
  isFeed = false
  preventDoubleTap = false
  sizeCharts = []

  ngOnInit() {
    this.commonService.setPageHeader("Assign Size Chart")
    this.getProductList()
    this.getProductCategories()
    this.getVendorList()
    $(document).mouseup(function (e) {
      let container = $("#filter");
      let matPanel = $(".mat-select-panel")
      let backdrop = $(".cdk-overlay-backdrop")
      let filterButton = $(".filter-btn")[0]
      if (filterButton == e.target) {
        if (!this.preventDoubleTap) {
          $("#filter").toggle("slow")
          this.preventDoubleTap = true
        }
        setTimeout(() => {
          this.preventDoubleTap = false
        }, 500)
      } else if (!container.is(e.target) && container.has(e.target).length === 0) {
        if (!matPanel.is(e.target) && matPanel.has(e.target).length === 0) {
          if (!backdrop.is(e.target) && backdrop.has(e.target).length === 0) {
            if (!this.preventDoubleTap) {
              $("#filter").fadeOut("slow");
              this.preventDoubleTap = true
            }
            setTimeout(() => {
              this.preventDoubleTap = false
            }, 500)
          }
        }
      }

    });
  }

  getProductList() {
    this.hideFilter()
    this.productsLoading = true
    const feed = this.isFeed
    const filter = {
      name: this.filterText,
      categories: this.filterParams.categories.toString(),
      vendorName: this.filterParams.vendorName.toString(),
    }
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

  submit() {
    if(!this.checkedProducts.length){
      this.commonService.openErrorSnackBar("Please select products to continue", "")
    } else if (!this.sizeCharts.length) {
      this.commonService.openErrorSnackBar("Please upload a size chart to continue", "")
    } else {
      const productIds = this.checkedProducts.map(product => { return product.id })
      const urls = this.sizeCharts.map(sizeChart => { return sizeChart.url })
      this.commonService.toggleLoading(true)
      this.productService.uploadBulkSizeChart({
        productIds, urls
      }).subscribe(res => {
        this.commonService.toggleLoading(false)
        this.commonService.openSuccessSnackBar("Size chart applied to selected group of products", "")
        this.router.navigate(['productmanager/dashboard'])
      }, err => {
        this.commonService.toggleLoading(false)
      })
    }
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
    this.filterParams.vendorName = []
  }

  uploadSizeChart(files) {
    const formData = new FormData();
    formData.append("file", files.item(0));
    if (files.item(0).name.split(".").pop().toLowerCase() == "pdf") {
      this.commonService.toggleLoading(true)
      this.storeService.uploadPdfArt(formData).subscribe((response) => {
        this.commonService.toggleLoading(false)
        response.data.imageFileUrls.forEach((url) => {
          this.sizeCharts.push({ url });
        });
      }, err => {
        this.commonService.toggleLoading(false)
      });
    } else if (['jpg', 'png', 'jpeg', 'gif', 'webp', 'jfif'].includes(files.item(0).name.split(".").pop().toLowerCase())) {
      this.commonService.toggleLoading(true)
      this.storeService.uploadArt(formData).subscribe((response) => {
        this.commonService.toggleLoading(false)
        this.sizeCharts.push({ url: response.data });
      }, err => {
        this.commonService.toggleLoading(false)
      });
    } else {
      this.commonService.openErrorSnackBar("Invalid file format", "")
    }
  }

  getVendorList() {
    this.productService.getVendors().subscribe(res => {
      this.vendorList = res.body.data
    })
  }
}
