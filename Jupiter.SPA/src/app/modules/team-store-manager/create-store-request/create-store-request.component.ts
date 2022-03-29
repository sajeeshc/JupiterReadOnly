import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatRadioModule } from '@angular/material';
import { Router } from '@angular/router';
import { StoreManagerService } from "src/app/core/services/store-manager.service";
import { StoreService } from 'src/app/core/services/store.service';
import { CommonService } from 'src/app/core/services/common.service';
// import * as _moment from 'moment';
// const moment = _moment;
declare var $: any;

@Component({
  selector: 'app-create-store-request',
  templateUrl: './create-store-request.component.html',
  styleUrls: ['./create-store-request.component.scss']
})
export class CreateStoreRequestComponent implements OnInit {

  matRadioModule: MatRadioModule;
  loading: boolean;
  show: boolean = true;
  showForm1: boolean;
  showForm2: boolean;
  dataSource: any = [];
  product: any = {};
  productsObj: any;
  closeResult = '';
  selectedObject: any = {};

  // /////////////////////////////////////////
  minDate: Date = new Date();
  createStoreForm: FormGroup;
  garmentsRequested: FormArray;
  categoryList: any = [];
  productList: any = [];
  selectedProducts: any = [];
  selectedCategory: any;
  selectedProduct: any;
  artArray: any[] = []
  colorArray: any[] = [];
  imageUrl: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public storeManagerService: StoreManagerService,
    private ref: ChangeDetectorRef,
    public storeService: StoreService,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit () {
    this.createForm();
    this.ShowOrHideForm(false, true);
    // this.createForm();
    this.getProductCategory();
    this.getProduct();
  }

  ShowOrHideForm (form1: boolean, form2: boolean) {

    this.showForm1 = form1;
    this.showForm2 = form2;

  }

  nextForm () {
    //if(this.createStoreForm.valid){
    this.ShowOrHideForm(true, false);
    //}
  }

  dateChanged (type, value) {
    var formattedDate = this.commonService.getFormattedDate(value);
    switch (type) {
      case 1:
        this.createStoreForm.controls['openDate'].setValue(formattedDate);
        break;
      case 2:
        this.createStoreForm.controls['productsInHandBy'].setValue(formattedDate);
        break;
      case 3:
        this.createStoreForm.controls['closeDate'].setValue(formattedDate);
        break;
      default:
        break;
    }
  }

  formatDate (date) {
    var formattedDate = this.commonService.getFormattedDate(date);
    return formattedDate;
  }

  // //////////////////////////////////////////////////////////////////////////////////////////

  createForm () {
    this.createStoreForm = this.formBuilder.group({
      createType: new FormControl(4),
      stage: new FormControl(1),
      name: new FormControl('', Validators.required),
      contactName: new FormControl('', Validators.required),
      emailId: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      organizationName: new FormControl('', Validators.required),
      organizationAddress: new FormControl('', Validators.required),
      openDate: new FormControl('', Validators.required),
      productsInHandBy: new FormControl('', Validators.required),
      closeDate: new FormControl('', Validators.required),
      club: new FormControl('', Validators.required),
      shippingPreference: new FormControl('', Validators.required),
      shipToAddress: new FormControl('', Validators.required),
      fundRaisingClaimPreference: new FormControl('1'),
      storeClosureMode: new FormControl('1'),
      rebateCheckAddress: new FormControl('', Validators.required),
      garmentsRequested: this.formBuilder.array([]),
      artsRequested: [],
      customerNotes: new FormControl(''),
      printColorsRequested: new FormControl(''),
      discount: new FormControl(''),
      availableToCopy: new FormControl(true)
    });
  }

  createProductForm (product, id): FormGroup {
    return this.formBuilder.group({
      productid: id,
      productName: [product],
      price: [],
      fundraiserAmount: [],
      fundraiserPercentage: [],
      discount: [],
      total: []
    });
  }

  getProductCategory () {
    this.storeManagerService.getProductCategory().subscribe(
      (response) => {
        this.categoryList = response.body.data;
      },
      (error) => {

      }
    );
  }

  getProduct () {
    this.storeManagerService.getProduct().subscribe(
      (response) => {
        this.productList = response.body.data;
      },
      (error) => {
      }
    );
  }

  productSelected (value) {
    var productList = this.createStoreForm.get('garmentsRequested').value;
    const found = productList.some(el => el.productid === value.id);
    if (!found) {
      $('#addProductModal').modal('hide');
      this.garmentsRequested = this.createStoreForm.get('garmentsRequested') as FormArray;
      this.garmentsRequested.push(this.createProductForm(value.name, value.id));
    }
    this.selectedCategory = "";
    this.selectedProduct = {};
  }

  removeProduct (index) {
    this.garmentsRequested.removeAt(index);
  }

  getTotal (index) {
    var price = this.createStoreForm.get('garmentsRequested')['controls'][index].value.price;
    var fundraisingPercentage = this.createStoreForm.get('garmentsRequested')['controls'][index].value.fundraiserPercentage;
    var fundraisingAmount = this.getProductfundraisingAmount(price, fundraisingPercentage);
    var discount = this.createStoreForm.get('garmentsRequested')['controls'][index].value.discount;
    var total = price + fundraisingAmount - discount;
    this.createStoreForm.get('garmentsRequested')['controls'][index].patchValue({
      total: total,
      fundraiserAmount: fundraisingAmount
    });
  }

  getProductfundraisingPercentage (index) {
    var price = this.createStoreForm.get('garmentsRequested')['controls'][index].value.price;
    var fundraisingAmount = this.createStoreForm.get('garmentsRequested')['controls'][index].value.fundraiserAmount;
    var fundraisingPercentage = fundraisingAmount * 100 / price;
    this.createStoreForm.get('garmentsRequested')['controls'][index].patchValue({
      fundraiserPercentage: fundraisingPercentage
    });
    this.getTotal(index);
  }

  getProductfundraisingAmount (price, fundraisingPercentage) {
    var fundraisingAmount;
    fundraisingAmount = price * fundraisingPercentage / 100;
    return fundraisingAmount;
  }

  addImageLink () {
    if (this.imageUrl != null && this.imageUrl != '') {
      this.artArray.push(this.imageUrl);
      this.imageUrl = "";
      $('#addArtModal').modal('hide');
    } else {
      this.commonService.openWarningSnackBar('Please enter a category name', '');
    }

  }

  removeArt (removalIndex) {
    this.artArray.splice(removalIndex, 1);
  }

  createStoreRequest () {
    if (this.createStoreForm.valid) {
      var colorList = this.createStoreForm.get('printColorsRequested').value;
      var colorArray = colorList.split(",");
      this.createStoreForm.controls['printColorsRequested'].setValue(colorArray);
      this.createStoreForm.controls['artsRequested'].setValue(this.artArray);
      this.createStoreForm.controls['createType'].setValue(4);

      this.createStoreForm.value.openDate = this.formatDate(this.createStoreForm.controls['openDate'].value)
      this.createStoreForm.value.productsInHandBy = this.formatDate(this.createStoreForm.controls['productsInHandBy'].value)
      this.createStoreForm.value.closeDate = this.formatDate(this.createStoreForm.controls['closeDate'].value)

      this.storeService.createStore(this.createStoreForm.value).subscribe(
        (response) => {
          if (response.status == 1) {
            this.commonService.openSuccessSnackBar(response.message, "");
            this.router.navigateByUrl('storemanager/dashboard');
          }
          else {
            this.commonService.openErrorSnackBar(response.message, "");

          }
        },
        (error) => {
          this.commonService.openErrorSnackBar(error.message, "");
          this.createStoreForm.controls['printColorsRequested'].setValue(colorList);
        }
      );
    }

  }

  onChangeColorCmyk (event) {
    var selectedColor = this.createStoreForm.controls['printColorsRequested'].value;
    selectedColor = selectedColor != '' ? selectedColor + ',' + event : event;
    this.createStoreForm.controls['printColorsRequested'].setValue(selectedColor);
  }

}
