import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { StoreService } from 'src/app/core/services/store.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-shipping-methods',
  templateUrl: './shipping-methods.component.html',
  styleUrls: ['./shipping-methods.component.scss']
})
export class ShippingMethodsComponent implements OnInit {

  storeId: number
  shippingMethods = []              // [{id,name,...}...]
  selectedShippingmethods = []      // [{orderIndex:0,shippingMethod:{id,name,...}},...]
  selectedMethodIds = []
  constructor(
    private storeService: StoreService,
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.storeId = parseInt(localStorage.getItem("teamStoreId"));
    this.setUpShippingMethods()
    this.getAllShippingMethods()

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedShippingmethods, event.previousIndex, event.currentIndex);
  }

  getAllShippingMethods() {
    this.storeService.getShippingAndPickUpMethods(this.storeId).subscribe(
      (response) => {
        this.shippingMethods = response.data
      },
      (error) => {
        console.log(error)
        // this.alertService.error("Unable to get data");
      }
    );
  }

  setUpShippingMethods() {
    this.storeService.getStoreShippingMethods(this.storeId).subscribe(
      (response) => {
        this.selectedShippingmethods = response.data.map((method,index)=>{
          return {orderIndex:index,shippingMethod:method}
        })
        for (let method of this.selectedShippingmethods) {
          this.selectedMethodIds.push(method.shippingMethod.id)
        }
        // this.selectedShippingmethods.sort(this.getSortOrder("orderIndex"))
      },
      (error) => {
        console.log(error)
        // this.alertService.error("Unable to get data");
      }
    );
  }

  addShippingMethods() {
    let i = 0
    this.selectedShippingmethods = []
    for (let method of this.shippingMethods) {
      if (this.selectedMethodIds.indexOf(method.id) > -1) {
        this.selectedShippingmethods.push({ "orderIndex": i++, "shippingMethod": method })
      }
    }
  }

  check(event) {
    if (event.srcElement.checked) {
      if (this.selectedMethodIds.indexOf(event.srcElement.value) === -1) {
        this.selectedMethodIds.push(Number(event.srcElement.value))
      }
    } else {
      let index = this.selectedMethodIds.indexOf(event.srcElement.value)
      this.selectedMethodIds.splice(index, 1)
    }
  }

  checkSelected() {
    this.selectedMethodIds = this.selectedShippingmethods.map(method => {
      return method.shippingMethod.id
    })
  }

  clear(id) {
    // let index = this.selectedShippingmethods.indexOf(method)
    // this.selectedShippingmethods.splice(index, 1)
    this.selectedShippingmethods = this.selectedShippingmethods.filter(method=>method.shippingMethod.id != id)
    // index = this.selectedMethodIds.indexOf(method)
    // this.selectedMethodIds.splice(index, 1)

    this.checkSelected()
  }

  submit() {
    let sortedShippingMethods = []
    if(!this.selectedShippingmethods.length){
      this.commonService.openErrorSnackBar("Please add atleast one method to save","")
      return
    }
    for (let method of this.selectedShippingmethods) {
      // sortedShippingMethods.push({ "orderIndex": i++, "shippingMethodId": method.shippingMethod.id })
      sortedShippingMethods.push(method.shippingMethod.id)
    }
    this.storeService.saveStoreShippingMethods(this.storeId, sortedShippingMethods).subscribe(
      // this.storeService.updateShippingMethods(this.storeId, sortedShippingMethods).subscribe(
      (response) => {
        // if (response.status == 1) {
        //   this.commonService.openSuccessSnackBar(response.message, '');
        //   const url = this.commonService.createUrl(this.router.url, '/storepickup', 2);
        //   this.router.navigateByUrl(url);
        // } else {
        //   this.commonService.openErrorSnackBar(response.message, '');
        // }
          this.commonService.openSuccessSnackBar("Shipping methods updated successfully", '');

      },
      (error) => {
        console.log(error)
        // this.alertService.error("Error while updating privacy settings");
      }
    );
  }


  getSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }

}
