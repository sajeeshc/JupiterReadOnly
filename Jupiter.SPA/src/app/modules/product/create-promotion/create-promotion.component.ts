import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { Options, LabelType } from "@angular-slider/ngx-slider";
import { ProductService } from 'src/app/core/services/product.service';
import { StoreService } from 'src/app/core/services/store.service';
var moment = require('moment');
declare var $: any

@Component({
  selector: 'app-create-promotion',
  templateUrl: './create-promotion.component.html',
  styleUrls: ['./create-promotion.component.scss']
})
export class CreatePromotionComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService,
  ) { }

  filterParams = {
    minPrice: 0,
    maxPrice: 500,
    name: '',
    colors: [],
    categories: [],
    sizes: [],
    brands: [],
  }
  productsLoading = false
  options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min price:</b> $" + value;
        case LabelType.High:
          return "<b>Max price:</b> $" + value;
        default:
          return "$" + value;
      }
    }
  };

  categoryList = []
  colorList = []
  sizeList = []
  brandList = []

  productList = []
  selectedProducts = []
  checkedProducts = []
  checkedProductsSelected = []
  checkAllUncategorized = false
  checkAllSelected = false
  selectAll_1 = false
  selectAll_2 = false
  filteredProductList = []
  selectedFilteredProductList = []
  displayedColumns = ['product']
  filterText = ''
  filterSelectedText = ''

  name = ''
  description = ''
  startDate: any = new Date()
  endDate: any = new Date()
  minDate = new Date()
  price: any = ''
  id = 0
  isActive = true

  ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'];
    this.getProductList()
    this.commonService.setPageHeader("Create Promotion");
    this.getProductCategories()
    this.getProductColors()
    this.getSizes()
    $(document).mouseup(function (e) {
      let container = $("#filter");
      let matPanel = $(".mat-select-panel")
      let backdrop = $(".cdk-overlay-backdrop")
      let filterButton = $(".advanced-search")[0]
      console.log(e.target)
      console.log(filterButton)
      if (filterButton==e.target) {
        console.log("this working")
        $("#filter").toggle("slow")
      }else if (!container.is(e.target) && container.has(e.target).length === 0) {
        if (!matPanel.is(e.target) && matPanel.has(e.target).length === 0) {
          if (!backdrop.is(e.target) && backdrop.has(e.target).length === 0) {
            $("#filter").fadeOut("slow");
          }
        }
      }
    });
  }

  getProductList() {
    this.productService.getProducts({ per_page: 0, feed: false, filter: this.formatFilterParams() }).subscribe(
      (response) => {
        this.productList = response.body.data;
        this.filterUncategorized()
        this.productsLoading = false

        if (this.id)
          this.getPromotion(this.id)
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

  addProducts() {
    this.checkedProducts.forEach(product => {
      this.selectedProducts.push(product)
    })
    this.productList = this.productList.filter(product => {
      return this.checkedProducts.includes(product) == false
    })
    this.checkedProducts = []
    this.filterSelected()
    this.filterUncategorized()
  }

  removeProducts() {
    this.checkedProductsSelected.forEach(product => {
      this.productList.push(product)
    })
    this.selectedProducts = this.selectedProducts.filter(product => {
      return this.checkedProductsSelected.includes(product) == false
    })
    this.checkedProductsSelected = []
    this.filterUncategorized()
    this.filterSelected()
  }

  filterUncategorized() {
    this.filteredProductList = this.productList.filter(product => {
      return (product.id + " - " + product.name).toLowerCase().indexOf(this.filterText.toLowerCase()) >= 0
    })
  }

  filterSelected() {
    this.selectedFilteredProductList = this.selectedProducts.filter(product => {
      return (product.id + " - " + product.name).toLowerCase().indexOf(this.filterSelectedText.toLowerCase()) >= 0
    })
  }

  submit() {
    if (this.selectedProducts.length > 0) {
      let data = {
        id: this.id,
        name: this.name,
        description: this.description,
        startDate: moment(this.startDate).format('MM/DD/yyyy HH:mm'),
        endDate: moment(this.endDate).format('MM/DD/yyyy HH:mm'),
        price: this.price,
        products: this.selectedProducts,
        isActive: this.isActive
      }
      this.productService.updatePromotion(data).subscribe(res => {
        if (this.id)
          this.commonService.openSuccessSnackBar("Promotion updated successfully", "")
        else
          this.commonService.openSuccessSnackBar("Promotion created successfully", "")
        this.router.navigateByUrl('/productmanager/promotionlist')
      })
    } else {
      this.commonService.openErrorSnackBar("Select and add products to continue", "")
    }
  }

  getPromotion(id) {
    this.productService.getPromotion(id).subscribe(res => {
      this.name = res.body.data.name
      this.description = res.body.data.description
      this.price = res.body.data.price
      this.startDate = moment(res.body.data.startDate, "MM/DD/YYYY HH:mm").toDate()
      this.endDate = moment(res.body.data.endDate, "MM/DD/YYYY HH:mm").toDate()
      this.selectedProducts = res.body.data.products
      this.isActive = res.body.data.isActive
      this.selectedProducts.forEach(product => {
        this.productList.splice(this.productList.findIndex(p => { return p.id == product.id }), 1)
      })
      this.filterSelected()
      this.filterUncategorized()
    })
  }


  getSizes() {
    this.productService.getAllAvailableSizes().subscribe(response => {
      this.sizeList = response.sizes
    })
  }

  getProductColors() {
    this.storeService.getAvailableStoreColors().subscribe(
      (response) => {
        this.colorList = response.data;
      },
      (error) => {

      }
    );
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

  // showFilter() {
  //   $("#filter").fadeIn("slow");
  // }

  formatFilterParams() {
    let formattedParams = { keyword: this.filterText, minPrice: this.filterParams.minPrice, maxPrice: this.filterParams.maxPrice }
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
    $("#filter").fadeOut("slow");
    return formattedParams
  }

  resetFilter() {
    this.filterParams = {
      minPrice: 0,
      maxPrice: 500,
      name: '',
      colors: [],
      categories: [],
      sizes: [],
      brands: [],
    }
    this.filterText = ''
    this.filterSelected()
  }

  closeFilter() {
    $("#filter").fadeOut("slow");
  }
}
