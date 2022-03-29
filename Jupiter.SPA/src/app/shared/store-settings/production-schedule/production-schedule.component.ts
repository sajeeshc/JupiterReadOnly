import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

@Component({
  selector: 'app-production-schedule',
  templateUrl: './production-schedule.component.html',
  styleUrls: ['./production-schedule.component.scss']
})
export class ProductionScheduleComponent implements OnInit {

  productionScheduleGroup: FormGroup;
  isProductionScheduleExpectedDateBoxVisible: boolean;
  storeId: number
  productionScheduleType: any = 1
  productShippedByDate
  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private storebuilderService: StorebuilderService,
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.storeId = parseInt(localStorage.getItem("teamStoreId"));
    this.setUpProductionScheduleFormGroup()
    this.changeProductionScheduleExpectedDateBoxHidden(false);
    this.getProductionSchedule()
  }

  setUpProductionScheduleFormGroup() {
    this.productionScheduleGroup = this.formBuilder.group({
      expectedDate: new FormControl(''),
      productionScheduleType: new FormControl('')
    });
  }

  changeProductionScheduleExpectedDateBoxHidden(value: boolean) {
    this.isProductionScheduleExpectedDateBoxVisible = value;
    if (this.isProductionScheduleExpectedDateBoxVisible == false) {
      this.productionScheduleGroup.controls['expectedDate'].setValidators(Validators.required);
      this.productionScheduleGroup.controls['expectedDate'].updateValueAndValidity();
    }
    else {
      this.productionScheduleGroup.controls['expectedDate'].clearValidators();
      this.productionScheduleGroup.controls['expectedDate'].updateValueAndValidity();
    }
  }

  getProductionSchedule() {
    this.storebuilderService.getTeamStore(this.storeId).subscribe(
      (response) => {
        this.productShippedByDate = response.data.productShippedBy
        // this.setProductionScheduleValues(response.data.productShippedBy)
      },
      (error) => {
        console.log(error)
        // this.alertService.error("Unable to get data");
      }
    );
  }

  setProductionScheduleValues(productionSchedule) {
    let dateArr = productionSchedule.split("/") //dd/mm/yyyy
    let date = new Date(dateArr[2], dateArr[1], dateArr[0]) // yyyy,mm,dd
    this.productionScheduleGroup.setValue({
      expectedDate: date,
      productionScheduleType: productionSchedule.productionScheduleType
    });
    this.productionScheduleType = productionSchedule.productionScheduleType
    this.changeProductionScheduleExpectedDateBoxHidden(productionSchedule.productionScheduleType == 0)
  }

  submit() {
    let productionScheduleType = this.productionScheduleGroup.get("productionScheduleType").value
    let expectedDate = null
    if (productionScheduleType == 1) {
      let date: Date = this.productionScheduleGroup.get("expectedDate").value
      expectedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
    }
    this.storeService.updateProductionSchedule(this.storeId, { expectedDate, productionScheduleType }).subscribe(
      (response) => {
        if (response.status == 1) {
          this.commonService.openSuccessSnackBar(response.message, '');
          const url = this.commonService.createUrl(this.router.url, '/shippingmethods', 2);
          this.router.navigateByUrl(url);

        } else {
          this.commonService.openErrorSnackBar(response.message, '');
        }

      },
      (error) => {
        console.log(error)
        // this.alertService.error("Error while updating privacy settings");
      }
    );

  }


}
