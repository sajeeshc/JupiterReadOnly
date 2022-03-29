import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreManagerService } from 'src/app/core/services/store-manager.service';

declare var $: any;

@Component({
  selector: 'app-store-order-status',
  templateUrl: './store-order-status.component.html',
  styleUrls: ['./store-order-status.component.scss']
})
export class StoreOrderStatusComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private managerService: StoreManagerService,
    private commonService: CommonService
  ) { }

  storeId
  orders = []
  storeName = ''
  totalSales = ''
  selectedPersonalization
  cancelAll = true
  quantityToCancel = new FormControl(0)
  selectedOrderIndex = null
  selectedLineItemIndex = null
  selectedPersonalizationIndex = null

  ngOnInit() {
    this.storeId = this.route.snapshot.params['storeId'];
    this.commonService.setPageHeader("Store Order Status")
    if (this.storeId) {
      this.getStoreOrder()
    }
  }

  getStoreOrder() {
    this.managerService.getStoreOrderByStoreId(this.storeId).subscribe((res: any) => {
      this.orders = res.data.records
      this.storeName = res.data.storeDetail.name
      this.totalSales = res.data.totalSales
    })
  }

  cancelProduct(id, i, j) {
    this.managerService.cancelProduct(id).subscribe(res => {
      this.orders[i].lineItems.splice(j, 1)
      this.commonService.openSuccessSnackBar("Product removed successfully", "")
      if (this.orders[i].length = 0)
        this.commonService.openSuccessSnackBar("Order cancelled", "")
    })
  }

  cancelPersonalization(personalization, i, j, k) {
    this.selectedOrderIndex = i
    this.selectedLineItemIndex = j
    this.selectedPersonalizationIndex = k
    this.quantityToCancel.setValue(personalization.quantity)
    this.quantityToCancel.disable()
    this.quantityToCancel.setValidators([Validators.max(personalization.quantity), Validators.min(1), Validators.required])
    this.cancelAll = true
    this.selectedPersonalization = personalization
  }

  submit() {
    let data = {
      personalizationId: this.selectedPersonalization.id,
      quantity: this.selectedPersonalization.quantity
    }
    if (!this.cancelAll) {
      if (this.quantityToCancel.valid) {
        data.quantity = this.quantityToCancel.value
      } else {
        this.commonService.openErrorSnackBar("Invalid quantity to cancel", "")
        return
      }
    }
    this.managerService.cancelProductPersonalization(data).subscribe((res: any) => {
      // console.log(res.data.data)

      if (this.selectedOrderIndex != null && this.selectedPersonalizationIndex != null) {
        if (res.data.data){
          this.orders[this.selectedOrderIndex].lineItems[this.selectedLineItemIndex] = res.data.data
        }else{
          this.orders[this.selectedOrderIndex].lineItems[this.selectedLineItemIndex].personalizations.splice(this.selectedPersonalizationIndex, 1)
          if(this.orders[this.selectedOrderIndex].lineItems[this.selectedLineItemIndex].personalizations.length == 0){
            this.orders[this.selectedOrderIndex].lineItems.splice(this.selectedLineItemIndex,1)
          }
        }
      }
      // this.getStoreOrder()
      this.commonService.openSuccessSnackBar("Cancelled successfully", "")
      $("#cancelModal").modal("hide")
    })
  }

  onRadioButtonChange() {
    if (this.cancelAll)
      this.quantityToCancel.disable()
    else
      this.quantityToCancel.enable()
  }
}
