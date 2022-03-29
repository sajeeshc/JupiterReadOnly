import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { DatePipe } from "@angular/common";
import { timeout } from "rxjs/operators";
import { StoredetailsService } from "src/app/core/services/storedetails.service";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";
import { CommonService } from "src/app/core/services/common.service";
import { Router } from "@angular/router";
declare var $: any;

@Component({
  selector: "app-store-pickup",
  templateUrl: "./store-pickup.component.html",
  styleUrls: ["./store-pickup.component.scss"],
})
export class StorePickupComponent implements OnInit {
  storePickupGroup: FormGroup;
  storePickup: any[] = [];
  model: any = {};
  teamstorePickup: any;
  obj: any = {};
  selectedValue: any;
  teamStoreId: number;
  selectedItemIndex: number;

  pickUpGroup: FormGroup;
  addPickUpGroup: FormGroup;
  pickUpArray: any[] = [];
  showAddressModal: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private storedetailsService: StoredetailsService,
    private storeBuilderService: StorebuilderService,
    private commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.createPickUpGroup();
    this.onModalFirstCall();
    this.getPickUpMethods();
  }

  getPickUpMethods() {
    this.storeBuilderService
      .getTeamStore(this.teamStoreId)
      .subscribe((response) => {
        var teamStore = response.data;
        this.pickUpArray = teamStore.pickUpMethods;
      });
  }

  onModalFirstCall() {
    $("#time-picker").hide() && $("#processing-time").show();
    timeout(1000);
    this.selectedValue = "0";
    console.log(this.selectedValue);
    this.showAddressModal = false;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.pickUpArray, event.previousIndex, event.currentIndex);
  }

  createPickUpGroup() {
    this.addPickUpGroup = this.formBuilder.group({
      id: new FormControl(0),
      locationName: new FormControl(""),
      pickUpDetails: new FormControl(""),
      pickUpSchedule: new FormControl(""),
      processingTime: new FormControl(""),
      country: new FormControl(""),
      address: new FormControl(""),
      apartment: new FormControl(""),
      city: new FormControl(""),
      state: new FormControl(""),
      zipCode: new FormControl(""),
      pickUpAddressOn: new FormControl(false),
      pickUpStartDate: new FormControl(""),
      pickUpEndDate: new FormControl(""),
      startTime: new FormControl(""),
      endTime: new FormControl(""),
      timeZone: new FormControl(""),
      taxableZipCode: new FormControl(""),
    });
  }

  addRow() {
    if (this.addPickUpGroup.valid) {
      this.createArrayObj();
      this.pickUpArray.push(this.obj);
      this.obj = {};
      this.addPickUpGroup.reset();
      $("#addPickUpModal").modal("toggle");
      this.onModalFirstCall();
      this.toggleTimeModal();
    }

  }

  createArrayObj() {
    var datePipe = new DatePipe("en-US");
    var teamStorePickUpAddress = {};
    var processingTime = 0;
    var pickUpAddressOn = false;
    if (this.showAddressModal == false) {
      teamStorePickUpAddress = null;
      pickUpAddressOn = false;
    } else {
      pickUpAddressOn = true;
      teamStorePickUpAddress = {
        country: this.addPickUpGroup.get("country").value,
        address: this.addPickUpGroup.get("address").value,
        apartment: this.addPickUpGroup.get("apartment").value,
        city: this.addPickUpGroup.get("city").value,
        state: this.addPickUpGroup.get("state").value,
        zipCode: this.addPickUpGroup.get("zipCode").value,
      };
    }
    var teamStorePickUpDate = {};
    var s = this.addPickUpGroup.get("pickUpStartDate").value;

    switch (this.selectedValue) {
      case "0":
        teamStorePickUpDate = null;
        processingTime = this.addPickUpGroup.get("processingTime").value;
        break;
      case "1":
        teamStorePickUpDate = null;
        processingTime = 0;
        break;
      case "2":
        processingTime = 0;
        teamStorePickUpDate = {
          pickUpStartDate: datePipe.transform(
            this.addPickUpGroup.get("pickUpStartDate").value,
            "dd/MM/yyyy"
          ), //dd/mm/yyyy
          pickUpEndDate: null, //dd/mm/yyyy
          startTime: this.addPickUpGroup.get("startTime").value, //HH:mm
          endTime: this.addPickUpGroup.get("endTime").value, //HH:mm,
          timeZone: this.addPickUpGroup.get("timeZone").value,
        };
        break;
      case "3":
        processingTime = 0;
        teamStorePickUpDate = {
          pickUpStartDate: datePipe.transform(
            this.addPickUpGroup.get("pickUpStartDate").value,
            "dd/MM/yyyy"
          ), //dd/mm/yyyy
          pickUpEndDate: datePipe.transform(
            this.addPickUpGroup.get("pickUpEndDate").value,
            "dd/MM/yyyy"
          ), //dd/mm/yyyy
          startTime: this.addPickUpGroup.get("startTime").value, //HH:mm
          endTime: this.addPickUpGroup.get("endTime").value, //HH:mm,
          timeZone: this.addPickUpGroup.get("timeZone").value,
        };
        break;
    }
    this.obj = {
      id: this.addPickUpGroup.get("id").value,
      locationName: this.addPickUpGroup.get("locationName").value,
      pickUpDetails: this.addPickUpGroup.get("pickUpDetails").value,
      pickUpSchedule: this.addPickUpGroup.get("pickUpSchedule").value, // 0-OnDemand,1-NoPickUpDate,2-SetPickUpDate,3-SetPickUpDateRange
      processingTime: processingTime,
      teamStorePickUpDate: teamStorePickUpDate,
      pickUpAddressOn: pickUpAddressOn,
      teamStorePickUpAddress: teamStorePickUpAddress,
      taxableZipCode: this.addPickUpGroup.get("taxableZipCode").value,
    };
  }

  fetchModalDetails(): FormGroup {
    return this.addPickUpGroup.value;
  }

  toggleAddressModal() {
    if (this.showAddressModal == true) {
      this.setAddressValidation(this.showAddressModal);
      this.showAddressModal = false;

      this.addPickUpGroup.controls["country"].setValue("");
      this.addPickUpGroup.controls["apartment"].setValue("");
      this.addPickUpGroup.controls["city"].setValue("");
      this.addPickUpGroup.controls["state"].setValue("");
      this.addPickUpGroup.controls["zipCode"].setValue("");
      this.addPickUpGroup.controls["address"].setValue("");
    } else {
      this.setAddressValidation(this.showAddressModal);
      this.showAddressModal = true;
      this.addPickUpGroup.controls["taxableZipCode"].setValue("");
    }

  }

  setAddressValidation(value) {
    if (value == false) {
      this.setRequiredValidator('country');
      this.setRequiredValidator('apartment');
      this.setRequiredValidator('city');
      this.setRequiredValidator('state');
      this.setRequiredValidator('zipCode');
      this.setRequiredValidator('address');
      this.removeValidators('taxableZipCode');
    }
    else {
      this.setRequiredValidator('taxableZipCode');
      this.removeValidators('country');
      this.removeValidators('apartment');
      this.removeValidators('city');
      this.removeValidators('state');
      this.removeValidators('zipCode');
      this.removeValidators('address');
    }
  }

  toggleTimeModal() {
    switch (this.selectedValue) {
      case "0":
        $("#time-picker").hide() && $("#processing-time").show();
        this.addPickUpGroup.controls["pickUpStartDate"].setValue("");
        this.addPickUpGroup.controls["pickUpEndDate"].setValue("");
        this.addPickUpGroup.controls["endTime"].setValue("");
        this.addPickUpGroup.controls["startTime"].setValue("");
        this.addPickUpGroup.controls["timeZone"].setValue("");
        break;
      case "1":
        $("#time-picker").hide() && $("#processing-time").hide();
        this.addPickUpGroup.controls["pickUpStartDate"].setValue("");
        this.addPickUpGroup.controls["pickUpEndDate"].setValue("");
        this.addPickUpGroup.controls["endTime"].setValue("");
        this.addPickUpGroup.controls["startTime"].setValue("");
        this.addPickUpGroup.controls["timeZone"].setValue("");
        this.addPickUpGroup.controls["processingTime"].setValue("");
        break;
      case "2":
        $("#processing-time").hide() &&
          $("#end-date").hide() &&
          $("#time-picker").show();
        this.addPickUpGroup.controls["processingTime"].setValue("");
        this.addPickUpGroup.controls["pickUpEndDate"].setValue("");
        break;
      case "3":
        $("#processing-time").hide() &&
          $("#end-date").show() &&
          $("#time-picker").show();
        this.addPickUpGroup.controls["processingTime"].setValue("");
        break;
    }
    this.setTimeValidations(this.selectedValue);
  }

  setTimeValidations(value) {
    switch (value) {
      case "0":
        this.setRequiredValidator('processingTime');
        this.removeValidators('timeZone');
        this.removeValidators('startTime');
        this.removeValidators('endTime');
        this.removeValidators('pickUpEndDate');
        this.removeValidators('pickUpStartDate');
        break;
      case "1":
        this.removeValidators('timeZone');
        this.removeValidators('startTime');
        this.removeValidators('endTime');
        this.removeValidators('pickUpEndDate');
        this.removeValidators('pickUpStartDate');
        this.removeValidators('processingTime');
        break;
      case "2":
        this.setRequiredValidator('timeZone');
        this.setRequiredValidator('startTime');
        this.setRequiredValidator('endTime');
        this.setRequiredValidator('pickUpStartDate');
        this.removeValidators('pickUpEndDate');
        this.removeValidators('processingTime');
        break;
      case "3":
        this.setRequiredValidator('timeZone');
        this.setRequiredValidator('startTime');
        this.setRequiredValidator('endTime');
        this.setRequiredValidator('pickUpEndDate');
        this.setRequiredValidator('pickUpStartDate');
        this.removeValidators('processingTime');
        break;
    }
  }

  setRequiredValidator(control) {
    this.addPickUpGroup.controls[control].setValidators([Validators.required]);
    this.addPickUpGroup.controls[control].updateValueAndValidity();
  }

  removeValidators(control) {
    this.addPickUpGroup.controls[control].clearValidators();
    this.addPickUpGroup.controls[control].updateValueAndValidity();
  }

  fillModal(item: any, index: number) {
    $("#create").hide() && $("#edit").show();
    this.selectedItemIndex = index;
    let startdate = new Date();
    let enddate = null;
    if (item.teamStorePickUpDate != null) {
      let startdateArr = item.teamStorePickUpDate.pickUpStartDate.split("/"); //dd/mm/yyyy
      let startDateDay: number = +startdateArr[0];
      let startDateMonth: number = +startdateArr[1];
      let startYear: number = +startdateArr[2];
      startdate = new Date(startYear, startDateMonth - 1, startDateDay);
      if (
        item.teamStorePickUpDate.pickUpEndDate != null &&
        item.teamStorePickUpDate.pickUpEndDate != ""
      ) {
        let enddateArr = item.teamStorePickUpDate.pickUpStartDate.split("/"); //dd/mm/yyyy
        let endDateDay: number = +enddateArr[0];
        let endDateMonth: number = +enddateArr[1];
        let endYear: number = +enddateArr[2];
        enddate = new Date(endYear, endDateMonth - 1, endDateDay);
      }
    }

    this.addPickUpGroup.setValue({
      id: item.id == null ? 0 : item.id,
      locationName: item.locationName,
      pickUpDetails: item.pickUpDetails,
      pickUpSchedule: item.pickUpSchedule,
      processingTime: item.processingTime,
      country:
        item.teamStorePickUpAddress == null
          ? ""
          : item.teamStorePickUpAddress.country,
      address:
        item.teamStorePickUpAddress == null
          ? ""
          : item.teamStorePickUpAddress.address,
      apartment:
        item.teamStorePickUpAddress == null
          ? ""
          : item.teamStorePickUpAddress.apartment,
      city:
        item.teamStorePickUpAddress == null
          ? ""
          : item.teamStorePickUpAddress.city,
      state:
        item.teamStorePickUpAddress == null
          ? ""
          : item.teamStorePickUpAddress.state,
      zipCode:
        item.teamStorePickUpAddress == null
          ? ""
          : item.teamStorePickUpAddress.zipCode,
      pickUpStartDate: startdate,
      pickUpEndDate: enddate,
      startTime:
        item.teamStorePickUpDate == null
          ? ""
          : item.teamStorePickUpDate.startTime,
      endTime:
        item.teamStorePickUpDate == null
          ? ""
          : item.teamStorePickUpDate.endTime,
      timeZone:
        item.teamStorePickUpDate == null
          ? ""
          : item.teamStorePickUpDate.timeZone,
      taxableZipCode: item.taxableZipCode,
      pickUpAddressOn: item.pickUpAddressOn,
    });
    this.toggleModalSettings(item);
    this.selectedValue = item.pickUpSchedule.toString();
    this.toggleTimeModal();
  }

  toggleModalSettings(item: any) {
    $("#addPickUpModal").modal("toggle");
    this.selectedValue = item.pickupSchedule;
    if (item.pickUpAddressOn == true) {
      this.showAddressModal = true;
    } else {
      this.showAddressModal = false;
    }
  }

  update() {
    this.createArrayObj();
    this.pickUpArray[this.selectedItemIndex] = this.obj;
    this.obj = {};
    this.dismissModal();
  }

  delete(index?: number) {
    if (index != null) {
      this.pickUpArray.splice(index, 1);
    } else {
      this.pickUpArray.splice(this.selectedItemIndex, 1);
    }
  }

  showBtns() {
    this.onModalFirstCall();
    $("#create").show() && $("#edit").hide();
  }

  dismissModal() {
    this.addPickUpGroup.reset();
    $("#addPickUpModal").modal("toggle");
    this.onModalFirstCall();
  }

  save() {
    this.storedetailsService
      .updateStorePickUpMethods(this.pickUpArray, this.teamStoreId)
      .subscribe(
        (response) => {
          if (response.status == 1) {
            this.commonService.openSuccessSnackBar(response.message, "");
            const url = this.commonService.createUrl(this.router.url, '/checkoutsettings', 2);
            this.router.navigateByUrl(url);
          } else {
            this.commonService.openErrorSnackBar(response.message, "");
          }
          //todo
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
