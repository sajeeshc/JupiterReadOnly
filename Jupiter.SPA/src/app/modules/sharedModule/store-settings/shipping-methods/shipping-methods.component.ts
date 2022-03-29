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
    private commonService : CommonService
  ) { }

  ngOnInit() {
    this.storeId = parseInt(localStorage.getItem("teamStoreId"));
    this.setUpShippingMethods();
    this.getAllShippingMenthods()
    
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedShippingmethods, event.previousIndex, event.currentIndex);
  }

  getAllShippingMenthods() {
    this.storeService.getShippingMethods().subscribe(
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
    this.storeService.getStore(this.storeId).subscribe(
      (response) => {
        this.selectedShippingmethods = response.data.shippingMethods
        for (let method of this.selectedShippingmethods) {
          this.selectedMethodIds.push(method.id)
        }
        this.selectedShippingmethods.sort(this.getSortOrder("orderIndex"))
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
    for(let method of this.shippingMethods){
      if(this.selectedMethodIds.indexOf(method.id)>-1){
        this.selectedShippingmethods.push({"orderIndex":i++,"shippingMethod":method})
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

  clear(method) {
    let index = this.selectedShippingmethods.indexOf(method)
    this.selectedShippingmethods.splice(index, 1)
    index = this.selectedMethodIds.indexOf(method)
    this.selectedMethodIds.splice(index, 1)

    this.checkSelected()
  }

  submit() {
    let sortedShippingMethods = []
    let i = 0;
    for (let method of this.selectedShippingmethods) {
      sortedShippingMethods.push({"orderIndex":i++,"shippingMethodId":method.shippingMethod.id})
    }
    this.storeService.updateShippingMethods(this.storeId, sortedShippingMethods).subscribe(
      (response) => {
        if(response.status == 1){
          this.commonService.openSuccessSnackBar(response.message,'');
          this.router.navigateByUrl("/storebuilder/storedetails/storesettings/storepickup");
      
        }else{
          this.commonService.openErrorSnackBar(response.message,'');
        }
        
      },
      (error) => {
        console.log(error)
        // this.alertService.error("Error while updating privacy settings");
      }
    );
  }
 

  getSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
} 

}
