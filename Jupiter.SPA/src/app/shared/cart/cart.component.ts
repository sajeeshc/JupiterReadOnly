import { Component, DebugEventListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import Swal from 'sweetalert2';

declare var $ : any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems: any;
  cartGridItems: any[] = [];
  totalAmount: any = 0;
  totalNumberOfProducts: number = 0;
  teamStoreId: any;
  purchaseType: any;
  noImagePlaceholder = "../../../../assets/images/default-image.jpg"

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private commonService: CommonService
  ) { }

  ngOnInit () {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.purchaseType = parseInt(localStorage.getItem("purchaseType"));
    this.getCartList();
    window.parent.postMessage("resize window -"+window.outerHeight, "*");

  }

  getCartList () {
    this.storeService.getCartList().subscribe(response => {
      this.cartItems = response.data;
      this.cartItems.cartItemsInfo = this.cartItems.cartItemsInfo.map(v => Object.assign(v, { selected: true }))
      this.totalAmount = this.calculateTotalAmount(this.cartItems.cartItemsInfo);
    },
      error => {
        this.cartItems = {};
        this.cartItems.cartItemsInfo = [];
        this.totalAmount = 0;
      });
  }

  deleteItem (product: any, index: any) {
    this.storeService.deleteProductFromCart(product.cartId).subscribe(response => {
      if (response.status == 1) {
        if (index != null) {
          this.cartItems.cartItemsInfo.splice(index, 1);
          this.totalAmount = this.calculateTotalAmount(this.cartItems.cartItemsInfo);
        }
      }
    },
      error => {
        // this.commonService.openErrorSnackBar(error.message, "");
      });
  }

  calculateTotalAmount (cartItemsInfo) {
    let totalAmount = 0;
    cartItemsInfo.forEach(item => {
      totalAmount += item.totalPrice;
    });
    return totalAmount.toFixed(2);
  }

  checkout () {
    let arr = [];
    let teamStoreIds = []
    this.cartItems.cartItemsInfo.forEach(item => {
      // if (item.selected) {
        if(!teamStoreIds.includes(item.teamStoreId))
          teamStoreIds.push(item.teamStoreId)
        arr.push(item);
      // }
    });
    if(teamStoreIds.length > 1){
      Swal.fire({
        icon: 'info',
        title: 'Remove unwanted products',
        html: '<h5>Multiple type of orders detected. Only one teamstore or direct purchase is allowed. Please remove unwanted products to continue.</h5>'
      })
      return
    }
    let checkoutObj = {
      cartItemsInfo: arr,
      totalPrice: Number(this.calculateTotalAmount(arr)),
      taxAmount: this.cartItems.taxAmount,
      totalWeight: this.cartItems.totalWeight,
      shippingBoxes: this.cartItems.shippingBoxes,
    }
    localStorage.setItem("purchaseType",this.cartItems.cartItemsInfo[0].purchaseType)
    localStorage.setItem("teamStoreId",this.cartItems.cartItemsInfo[0].teamStoreId)
    localStorage.setItem("checkoutObj", JSON.stringify(checkoutObj));
    if (this.purchaseType == 1 || this.purchaseType == 2) {
      this.router.navigateByUrl('enduser/directpurchase/checkout');
    } else {
      this.router.navigateByUrl('enduser/buyfromlivestore/checkout');
    }
  }

  addMore (product) {
    localStorage.setItem("purchaseType", product.purchaseType);
    if (product.purchaseType == 3) {
      localStorage.setItem("teamStoreId", product.teamStoreId);
      this.router.navigateByUrl('enduser/buyfromlivestore/editproductview/' + product.productId+ "-"+(product.cartItemGrids[0].colorId || '0') + '/' + product.cartId+'/'+product.mapCode);
    } else {
      if (product.purchaseType == 2) {
        localStorage.setItem("productId", product.productId);
        this.router.navigateByUrl('enduser/directpurchase/editproductview/' + product.designerCartId + '/' + product.cartId);
      } else {
        this.router.navigateByUrl('enduser/directpurchase/editproductview/' + product.productId + "-"+(product.cartItemGrids[0].colorId || '0') +  '/' + product.cartId);
      }

    }
  }

  goBackToProductSelection () {
    if (this.purchaseType == 1 || this.purchaseType == 2) {
      this.router.navigateByUrl('enduser/directpurchase/productlist');
    } else {
      this.router.navigateByUrl('enduser/buyfromlivestore/store/' + this.cartItems.cartItemsInfo[this.cartItems.cartItemsInfo.length - 1].teamStoreId);
    }

  }

  removeSelected () {
    let selectedCartIdArray = []
    this.cartItems.cartItemsInfo.forEach(cart => {
      if (cart.selected) {
        selectedCartIdArray.push(cart.cartId)
      }
    });
    if (selectedCartIdArray.length > 0) {
      this.storeService.deleteSelectedProductsFromCart(selectedCartIdArray).subscribe(
        res => {
          this.commonService.openSuccessSnackBar(res.message, "");
          this.getCartList()
        },
        err => {
          this.commonService.openErrorSnackBar("Unable to remove items", "");
        }
      )
    } else {
      this.commonService.openWarningSnackBar("Select products to remove", "");
    }

  }

  openPersonalizationModal(product){
    this.cartGridItems = product.cartItemGrids;
    if(this.cartGridItems != null)
      this.togglePersonalizationModal()
  }

  togglePersonalizationModal(){
    $('#personalizationModal').modal('toggle');
  }
}
