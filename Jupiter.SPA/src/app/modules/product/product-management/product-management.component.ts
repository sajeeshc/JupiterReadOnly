import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';

import { Options, LabelType } from "@angular-slider/ngx-slider";
import Swal from 'sweetalert2'
import { StoreService } from 'src/app/core/services/store.service';
declare var $: any

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {

  filterParams = {
    minPrice: 0,
    maxPrice: 500,
    name: '',
    colors: [],
    categories: [],
    sizes: [],
    brands: [],
    storeStatus:[],
    markets:[],
    description:'',
    styleName:'',
    vendorName:'',
  }
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
  productsLoading = false
  // productList = []
  storeStatus = []
  productGroupList = []
  decoGroupList = []
  services = []
  marginFormulas = []
  colorList = []
  categoryList = []
  sizeList = []
  brandList = []
  styleName = ''
  vendorName = ''

  selectedProducts = []
  selectedStoreStatus: any
  selectedCategories = []
  decoGroupId = ''
  selectedProductGroups = []
  alternateProducts = []
  relatedProducts = []
  companionProducts = []
  selectedFormula: any

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
  isFeed = false

  constructor(
    private productService: ProductService,
    private commonService: CommonService,
    private router: Router,
    private storeService: StoreService
  ) { }

  ngOnInit() {
    this.commonService.setPageHeader("Product Management")
    this.getProductList()
    this.getDecoGroups()
    this.getProductGroups()
    this.getStoreStatus()
    this.getServices()
    this.getMarginCalculationFormula()
    this.getProductCategories()
    this.getProductColors()
    this.getSizes()
    $(document).mouseup(function (e) {
      let container = $("#filter");
      let matPanel = $(".mat-select-panel")
      let backdrop = $(".cdk-overlay-backdrop")
      let filterButton = $(".advanced-search")[0]
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
    this.productsLoading = true
    const feed = this.isFeed
    this.productService.getProducts({ per_page: 0, feed, filter: this.formatFilterParams() }).subscribe(
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

  getProductCategories() {
    this.productService.getProductCategory().subscribe(
      (response) => {
        this.categoryList = response.body.data;
      },
      (error) => {

      }
    );
  }

  getMarginCalculationFormula() {
    this.productService.getAllProductMarginFormulas({}).subscribe(
      (response) => {
        this.marginFormulas = response.body.data;
      },
      (error) => {

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

  getSizes() {
    this.productService.getAllAvailableSizes().subscribe(response => {
      this.sizeList = response.sizes
    })
  }

  getProductGroups() {
    this.productService.getAllProductGroups({}).subscribe(
      (response) => {
        this.productGroupList = response.body.data;
      },
      (error) => {

      }
    );
  }

  getStoreStatus() {
    this.productService.getAllProductStatuses({}).subscribe(
      (response) => {
        this.storeStatus = response.body.data;
      },
      (error) => {

      }
    );
  }

  getServices() {
    this.productService.getAllProductServices({}).subscribe(
      (response) => {
        this.services = response.body.data;
      },
      (error) => {

      }
    );
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

  attributeDisplay(attribute1, attribute2) {
    if (attribute1 && attribute2) {
      if (attribute1.id == attribute2.id) {
        return attribute1.name;
      }
    }
    return "";
  }

  removeCategory(i) {
    this.selectedCategories = this.selectedCategories.filter((category, index) => {
      return i != index
    })
  }

  // removeFormula(i) {
  //   this.selectedFormula = this.selectedFormula.filter((category, index) => {
  //     return i != index
  //   })
  // }

  removeCompanionProducts(i) {
    this.companionProducts = this.companionProducts.filter((category, index) => {
      return i != index
    })
  }

  removeRelatedProducts(i) {
    this.relatedProducts = this.relatedProducts.filter((category, index) => {
      return i != index
    })
  }

  removeAlternateProducts(i) {
    this.alternateProducts = this.alternateProducts.filter((category, index) => {
      return i != index
    })
  }

  removeProductGroup(i) {
    this.selectedProductGroups = this.selectedProductGroups.filter((category, index) => {
      return i != index
    })
  }

  // removeStoreStatus(i) {
  //   this.selectedStoreStatus = this.selectedStoreStatus.filter((category, index) => {
  //     return i != index
  //   })
  // }

  // removeDecoLocations(i) {
  //   this.selectedProductLocations = this.selectedProductLocations.filter((category, index) => {
  //     return i != index
  //   })
  // }

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

  // filterUncategorized() {
  //   this.filteredProductList = this.productList.filter(product => {
  //     return (product.id + " - " + product.name).toLowerCase().indexOf(this.filterText.toLowerCase()) >= 0
  //   })
  // }

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
      categories: this.selectedCategories,
      groups: this.selectedProductGroups,
      decoGroupId: this.decoGroupId || 0,
      storeStatus: this.selectedStoreStatus,
      relatedProducts: this.relatedProducts,
      requiredComponents: this.companionProducts,
      alternateProducts: this.alternateProducts,
      marginCalculationId: this.selectedFormula,
      vendorName:this.vendorName,
      styleName:this.styleName
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
    this.selectedStoreStatus = null
    this.selectedCategories = []
    // this.selectedProductLocations = []
    this.selectedProductGroups = []
    this.alternateProducts = []
    this.relatedProducts = []
    this.companionProducts = []
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

  showFilter() {
    $("#filter").fadeIn("slow");
  }

  formatFilterParams() {
    let formattedParams = { name: this.filterText, minPrice: this.filterParams.minPrice, maxPrice: this.filterParams.maxPrice }
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
    formattedParams["description"] = this.filterParams.description
    formattedParams["storeStatus"] = this.filterParams.storeStatus.toString()
    formattedParams["markets"] = this.filterParams.markets.toString()
    formattedParams["styleName"] = this.filterParams.styleName
    formattedParams["vendorName"] = this.filterParams.vendorName
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
      storeStatus:[],
      markets:[],
      description:'',
      styleName:'',
      vendorName:'',
    }
    this.filterText = ''
    this.filterSelected()
  }

  closeFilter() {
    $("#filter").fadeOut("slow");
  }
}


