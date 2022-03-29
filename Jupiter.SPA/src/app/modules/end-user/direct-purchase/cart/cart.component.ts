import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems: any;
  totalAmount: any = 0;
  totalNumberOfProducts: number = 0;
  teamStoreId: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private commonService: CommonService
  ) { }

  ngOnInit () {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.getCartList();
  }

  getCartList () {
    this.storeService.getCartList().subscribe(response => {
      this.cartItems = response.data;
      this.cartItems.cartItemsInfo = this.cartItems.cartItemsInfo.map(v => Object.assign(v, { selected: true }))
      this.totalAmount = this.calculateTotalAmount(this.cartItems.cartItemsInfo);
    },
      error => {
        this.commonService.openErrorSnackBar(error.message, "");
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
        this.commonService.openErrorSnackBar(error.message, "");
      });
  }

  calculateTotalAmount (cartItemsInfo) {
    var totalAmount = 0;
    cartItemsInfo.forEach(item => {
      totalAmount += item.totalPrice;
    });
    return totalAmount.toFixed(2);
  }

  checkout () {
    var arr = [];
    this.cartItems.cartItemsInfo.forEach(item => {
      if (item.selected) {
        arr.push(item);
      }
    });
    var checkoutObj = {
      cartItemsInfo: arr,
      totalPrice: this.calculateTotalAmount(arr)
    }

    localStorage.setItem("checkoutObj", JSON.stringify(checkoutObj));
    // var purchaseType = parseInt(localStorage.getItem("purchaseType"));
    // if (purchaseType == 1) {
      this.router.navigateByUrl('enduser/directpurchase/checkout');
    // } else if (purchaseType == 2) {
    //   this.router.navigateByUrl('enduser/buyfromlivestore/checkout');
    // }
  }

  goBackToProductSelection () {
    // var purchaseType = parseInt(localStorage.getItem("purchaseType"));
    // if (purchaseType == 1) {
      this.router.navigateByUrl('enduser/directpurchase/productlist');
    // } else if (purchaseType == 2) {
    //   this.router.navigateByUrl('enduser/buyfromlivestore/store/' + this.teamStoreId);
    // }

  }
}
