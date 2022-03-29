import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import { StoreService } from 'src/app/core/services/store.service';

declare var $: any;
@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {

  teamStoreId: any;
  productId: any;
  product: any;
  quantityGroup: FormGroup;
  cartItemGrids: FormArray;
  personalizeValue: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) { }

  ngOnInit () {
    var purchaseType = parseInt(localStorage.getItem('purchaseType'));
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));

    if (purchaseType == 1) {
      let thisObj = {} = this;
      window.parent.postMessage("loaded", "*")
      window.addEventListener("message", function (e) {
        thisObj.productId = new String(e.data.productId).toString();
        thisObj.getDirectProductDetail(purchaseType);
        thisObj.createQuantityForm();
      }, false)
      // this.productId = thisObj.productId;
    } else {
      this.route.paramMap.subscribe(params => {
        this.productId = params.get('productId');
      });
      if (this.productId == null) {
        this.productId = localStorage.getItem('productId');
      }
      if (this.teamStoreId == 0) {
        this.getDirectProductDetail(purchaseType);
      } else {
        this.getTeamstoreProductDesignedDetails();
      }
      this.createQuantityForm();
    }
  }

  createQuantityForm () {
    this.quantityGroup = this.formBuilder.group({
      teamStoreId: this.teamStoreId,
      productId: this.productId,
      personalize: false,
      quantity: 0,
      totalPrice: 0,
      cartItemGrids: this.formBuilder.array([this.createItemGrids()])
    });
  }

  createItemGrids (): FormGroup {
    return this.formBuilder.group({
      color: new FormControl('3'),
      name: new FormControl(''),
      number: new FormControl(''),
      size: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required)
    });
  }

  addRow () {
    this.cartItemGrids = this.quantityGroup.controls.cartItemGrids as FormArray;
    this.cartItemGrids.push(this.createItemGrids());
  }

  deleteRow (index) {
    this.cartItemGrids = this.quantityGroup.controls.cartItemGrids as FormArray;
    if (this.cartItemGrids.length > 1)
      this.cartItemGrids.removeAt(index)
    this.getTotalQuantity();
  }

  getTeamstoreProductDesignedDetails () {
    this.storeService.getProductDetails(this.teamStoreId, this.productId,null).subscribe(response => {
      this.product = response.data;
      this.personalizeValue = this.product.productInfo.isPersonalize;
      this.quantityGroup.patchValue({
        personalize: this.product.productInfo.isPersonalize
      });
    },
      error => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
  }

  getDirectProductDetail (typeId) {
    this.storeService.getDirectProductDetail(this.productId, typeId).subscribe(response => {
      this.product = response.data;
      this.personalizeValue = this.product.productInfo.isPersonalize;
      this.quantityGroup.patchValue({
        personalize: this.product.productInfo.isPersonalize
      });
    },
      error => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
  }

  addtoCart () {
    if (this.quantityGroup.valid) {
      this.storeService.addToCart(this.quantityGroup.value).subscribe(response => {
        this.product = response.data;
        this.commonService.openSuccessSnackBar(response.message, "");
        if (this.teamStoreId == 0) {
          this.router.navigateByUrl('enduser/directpurchase/cart');
        } else {
          this.router.navigateByUrl('enduser/buyfromlivestore/cart');
        }

      },
        error => {
          this.commonService.openErrorSnackBar(error.message, "");
        });
    }

  }

  personalize (value) {
    this.cartItemGrids = this.quantityGroup.controls.cartItemGrids as FormArray;
    for (var i = 0; i <= this.cartItemGrids.length; i++) {
      if (value == true) {
      } else {

      }
      this.cartItemGrids.controls[i].patchValue({
        name: null,
        number: null
      });
    }
  }


  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  getTotalQuantity () {
    var cartItemGrids = this.quantityGroup.controls.cartItemGrids.value;
    var price = this.product.productInfo.totalPrice
    let totalQuantity = 0;
    for (var i = 0; i < cartItemGrids.length; i++) {
      totalQuantity += cartItemGrids[i].quantity;
    }
    this.quantityGroup.patchValue({
      quantity: totalQuantity,
      totalPrice: (totalQuantity * price).toFixed(2)
    });
  }

  onImgClick (src) {
    $(".img-holder").attr("src", src);
  }
}
