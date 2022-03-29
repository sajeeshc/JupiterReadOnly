import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import { StoreService } from 'src/app/core/services/store.service';
import Swal from 'sweetalert2'

declare var $: any;

@Component({
  selector: 'app-product-data',
  templateUrl: './product-data.component.html',
  styleUrls: ['./product-data.component.scss']
})
export class ProductDataComponent implements OnInit {

  categoryList: any[] = [];
  colorList: any[] = [];
  statusList: any[] = [];
  serviceList: any[] = [];
  decoGroupList: any[] = [];
  productList: any[] = [];
  productGroupList: any[] = [];
  itemTypeList = []
  productForm: FormGroup;
  // selectedProduct: any;
  // imgList: any[] = [];
  uploadedImageFile: any;
  selectedImageFileName: any = "";
  priceList
  dataSource = 'live'
  
  companionAutoText = new FormControl('')
  alternateAutoText = new FormControl('')
  relatedAutoText = new FormControl('')
  filteredCompProd: Observable<any[]>;
  filteredAltProd: Observable<any[]>;
  filteredRelProd: Observable<any[]>;

  constructor(
    private productService: ProductService,
    private storeService: StoreService,
    private commonService: CommonService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.commonService.setPageHeader("Product Data")
    this.createProductFormGroup();
    this.getProductList();
    this.getProductCategories();
    this.getDecoGroups();
    this.getProductGroups();
    this.getProductStatuses();
    this.getItemTypes()
    this.filteredCompProd = this.companionAutoText.valueChanges.pipe(
      startWith(''),
      map(value => this._filterComp(value))
    );
    this.filteredAltProd = this.alternateAutoText.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAlt(value))
    );
    this.filteredRelProd = this.relatedAutoText.valueChanges.pipe(
      startWith(''),
      map(value => this._filterRel(value))
    );
  }

  createProductFormGroup(data?) {
    if (data) {
      this.productForm = this.formBuilder.group({
        categories: this.formBuilder.control(data.categories || []),
        storeStatus: this.formBuilder.control(data.storeStatus || null),
        groups: this.formBuilder.control(data.groups || []),
        images: this.formBuilder.control(data.images || []),
        id: [data.id, Validators.required],
        name: data.name,
        displayName: data.displayName || data.name,
        description: this.formBuilder.control(data.description || ''),
        active: this.formBuilder.control(data.active || false),
        colors: this.formBuilder.control(data.colors || []),
        decoGroupId: this.formBuilder.control(data.decoGroupId || ''),
        product: data.id + " - " + data.name,
        requiredComponents: this.formBuilder.control(data.requiredComponents || []),
        alternateProducts: this.formBuilder.control(data.alternateProducts || []),
        relatedProducts: this.formBuilder.control(data.relatedProducts || []),
        pricings: this.formBuilder.control(data.pricings || []),
        itemTypeId: new FormControl(data.itemTypeId || ''),
        metaData: new FormControl(data.metaData || ''),
        adCopy: new FormControl(data.adCopy || ''),
      })
    } else {
      this.productForm = this.formBuilder.group({
        categories: [],
        groups: [],
        images: [],
        id: [null, Validators.required],
        name: '',
        displayName: null,
        description: new FormControl(),
        active: true,
        storeStatus: '',
        decoGroupId: '',
        product: new FormControl(),
        requiredComponents: new FormControl([]),
        alternateProducts: new FormControl([]),
        relatedProducts: new FormControl([]),
        itemTypeId: '',
        metaData: '',
        adCopy: '',
      })
    }
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

  getProductStatuses() {
    this.productService.getAllProductStatuses({}).subscribe(
      (response) => {
        this.statusList = response.body.data;
      },
      (error) => {

      }
    );
  }

  getProductServices() {
    this.productService.getAllProductServices({}).subscribe(
      (response) => {
        this.serviceList = response.body.data;
      },
      (error) => {

      }
    );
  }

  // getProductColors() {
  //   this.storeService.getAvailableStoreColors().subscribe(
  //     (response) => {
  //       this.colorList = response.data;
  //     },
  //     (error) => {

  //     }
  //   );
  // }

  getDecoGroups() {
    this.productService.getAllDecoGroups({ per_page: 0 }).subscribe(
      (response) => {
        this.decoGroupList = response.body.data;
      },
      (error) => {
      }
    );
  }

  getProductList() {
    const feed = this.dataSource == 'feed'
    this.productService.getProducts({ per_page: 0, feed }).subscribe(
      (response) => {
        this.productList = response.body.data;
        this.commonService.openSuccessSnackBar("Product data loaded from " + this.dataSource, "")
        this.companionAutoText.setValue('')
        this.alternateAutoText.setValue('')
        this.relatedAutoText.setValue('')
      },
      (error) => {

      }
    );
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

  onImgClick(src) {
    $(".img-holder").attr("src", src);
  }

  setProduct(event?) {
    if (event) {
      const productId = event.target.value.split(' - ')[0]
      const product = this.productList.find(p => { return p.id == productId })
      if (product) {
        this.getProductDetails(product.id)
      } else if (productId) {
        this.createProductFormGroup()
        this.commonService.openErrorSnackBar("Invalid product id", "")
      }
    } else {
      this.createProductFormGroup()
    }
  }

  getProductDetails(productId) {
    const feed = this.dataSource == 'feed'
    this.productService.getProductDetailsById(productId, feed).subscribe(response => {
      // this.selectedProduct = response.data;
      this.createProductFormGroup(response.data)
      // this.getSelectedProductLocations(productId);
      // this.setProductDataInField();
    },
      error => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
  }

  setPricingData(event) {
    let result = {}
    this.productForm.value.pricings.forEach(element => {
      let { size, originalPrice, salePrice, colorId } = element
      if (colorId == event.value.id)
        result[size] = { originalPrice, salePrice }
    });
    this.priceList = result
  }

  deleteImg(img) {
    Swal.fire({
      html: '<h5>Do you want to delete this image?</h5>',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productForm.get('images').setValue(
          this.productForm.value.images.filter(el => { return el.src != img.src })
        )
        this.commonService.openSuccessSnackBar("Image deleted successfully", "")
      }
    })
  }

  uploadImg() {
    let formData = new FormData();
    formData.append("file", this.uploadedImageFile);

    this.productService.uploadImgFile(formData).subscribe(res => {
      if (res) {
        let src = res.data;
        // this.imgList.push(url);
        this.productForm.get('images').value.push({ src })
        $('#productImg').attr("src", src);
      }
    }, (error) => {
      console.log(error)
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }

  selectImageFile(event) {
    let selectedFiles = event.target.files;
    this.uploadedImageFile = selectedFiles.item(0);
    this.selectedImageFileName = this.uploadedImageFile.name;
    event.target.value = '';
    this.uploadImg();
  }

  updateProduct() {
    if (this.productForm.valid) {
      const feed = this.dataSource == 'feed'
      this.productService.updateProductData(this.productForm.value, feed).subscribe(res => {
        this.commonService.openSuccessSnackBar("Product data updated successfully", "")
      })
    } else {
      this.commonService.openErrorSnackBar("Please select a product to update", "")
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

  onLocationServiceChange(event, i) {
    let locControl = this.productForm.get('locations')
    let value = locControl.value
    value[i].services = event.value
    locControl.setValue(value)
  }

  removeDecoLocations(i) {
    let cpControl = this.productForm.get('locations')
    let value = cpControl.value
    value.splice(i, 1)
    cpControl.setValue(value)
  }

  removeCompanionProducts(i) {
    let cpControl = this.productForm.get('requiredComponents')
    let value = cpControl.value
    value.splice(i, 1)
    cpControl.setValue(value)
  }

  removeRelatedProducts(i) {
    let rpControl = this.productForm.get('relatedProducts')
    let value = rpControl.value
    value.splice(i, 1)
    rpControl.setValue(value)
  }

  removeAlternateProducts(i) {
    let apControl = this.productForm.get('alternateProducts')
    let value = apControl.value
    value.splice(i, 1)
    apControl.setValue(value)
  }

  onDataSourceChange() {
    Swal.fire({
      html: '<h5>Do you want to change data source</h5>',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.getProductList()
        this.createProductFormGroup()
      } else {
        if (this.dataSource == 'live')
          this.dataSource = 'feed'
        else
          this.dataSource = 'live'
      }
    })
  }

  getItemTypes() {
    this.productService.getAllItemTypes({}).subscribe(
      (response) => {
        this.itemTypeList = response.body.data;
      },
    );
  }

  get itemType() {
    return this.itemTypeList.find(type => { return type.id == this.productForm.value.itemTypeId })
  }

  get decoGroup() {
    return this.decoGroupList.find(grp => { return grp.id == this.productForm.value.decoGroupId })
  }

  companionProductSelected(event){
    const prod = event.option.value
    this.productForm.get("requiredComponents").value.push(prod)
    this.companionAutoText.setValue('')
  }

  alternateProductSelected(event){
    const prod = event.option.value
    this.productForm.get("alternateProducts").value.push(prod)
    this.alternateAutoText.setValue('')
  }

  relatedProductSelected(event){
    const prod = event.option.value
    this.productForm.get("relatedProducts").value.push(prod)
    this.relatedAutoText.setValue('')
  }

  private _filterComp(value: string): string[] {
    const filterValue = value ? value.toString().toLowerCase() : '';

    return this.productList.filter(option => {
      if(!option.name)
        return false
      return option.name.toLowerCase().includes(filterValue)
      && this.productForm.get("requiredComponents").value.includes(option) == false;
    })
  }
  private _filterAlt(value: string): string[] {
    const filterValue = value ? value.toString().toLowerCase() : '';

    return this.productList.filter(option => {
      if(!option.name)
        return false
      return option.name.toLowerCase().includes(filterValue)
      && this.productForm.get("alternateProducts").value.includes(option) == false;
    })
  }
  private _filterRel(value: string): string[] {
    const filterValue = value ? value.toString().toLowerCase() : '';

    return this.productList.filter(option => {
      if(!option.name)
        return false
      return option.name.toLowerCase().includes(filterValue)
      && this.productForm.get("relatedProducts").value.includes(option) == false;
    })
  }
}
