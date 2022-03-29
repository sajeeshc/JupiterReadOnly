import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/core/services/common.service";
import { StoreService } from "src/app/core/services/store.service";
declare var $:any

@Component({
  selector: "app-shipping-methods",
  templateUrl: "./shipping-methods.component.html",
  styleUrls: ["./shipping-methods.component.scss", "../common-styles.scss"],
})
export class ShippingMethodsComponent implements OnInit {
  constructor(
    private commonService: CommonService,
    private storeService: StoreService
  ) {}

  shippingMethods = [];
  selectedMethod = {}
  selectedIndex = 0
  ngOnInit() {
    this.commonService.setPageHeader("Settings - Shipping and Pickup Methods");
    this.getShippingMethods();
  }

  getShippingMethods() {
    this.storeService.getShippingAndPickUpMethods().subscribe((res) => {
      this.shippingMethods = res.data;
    });
  }

  edit(index) {
    this.selectedIndex = index
    this.selectedMethod = this.shippingMethods[this.selectedIndex]
  }

  save(){
    this.storeService.updateShippingMethod(this.selectedMethod).subscribe(res=>{
      this.commonService.openSuccessSnackBar("Shipping method updated successfully","")
      this.shippingMethods[this.selectedIndex] = this.selectedMethod
      $('#update-modal').modal('hide')
    })
  }
}
