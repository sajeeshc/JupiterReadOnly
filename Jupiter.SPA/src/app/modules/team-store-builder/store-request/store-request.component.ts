import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { Router, ActivatedRoute } from "@angular/router";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";
import { StoreService } from "src/app/core/services/store.service";
import { DatePipe } from "@angular/common";
import { CommonService } from "src/app/core/services/common.service";
import { EnduserService } from "src/app/core/services/enduser.service";
import { SharedService } from "src/app/core/services/shared.service";

let moment = require("moment");
declare var $: any;

@Component({
  selector: "app-store-request",
  templateUrl: "./store-request.component.html",
  styleUrls: ["./store-request.component.scss"],
})
export class StorerequestComponent implements OnInit {
  teamStoreId: number;
  loading: boolean;
  teamStore: any;
  dataSource: any;
  storeRequestForm: FormGroup;
  organizationForm: FormGroup;
  matRadioModule: MatRadioModule;
  fundRaisingClaimValue: string;
  storeClosureValue: string = "1";
  shippingPreference: string;
  user: any;
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public phonePattern = "^\\([0-9]{3}\\)\\s[0-9]{3}\\-[0-9]{4}$";
  minDate = new Date();
  organizationArray: any[] = [];
  organization: any;
  organisationObj: any;
  organizationAddress: any;
  userInfo: any;
  email: string;
  departmentArray: any[] = [];
  stateArray: any[] = [];
  datesAllowed = {
    openDate: {
      minDate: moment().startOf('day'),
      value: moment().add(1, 'days').startOf('day'),
    },
    closeDate: {
      minDate: moment().add(1, 'days').startOf('day'),
      value: moment().add(2, 'weeks').add(1, 'days').endOf('day'),
    },
    productShippedBy: {
      minDate: moment().add(5, 'weeks').add(1, 'days').startOf('day'),
      value: moment().add(5, 'weeks').add(1, 'days').startOf('day'),
    }
  }
  instituitionArray: any[] = [];
  marketArray: any[] = [];
  marketGroupArray: any[] = [];
  teamStoreObj: any[];
  constructor(
    private formBuilder: FormBuilder,
    private storeBuilderService: StorebuilderService,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private router: Router,
    private commonService: CommonService,
    private endUserService: EnduserService,
    private sharedService: SharedService
  ) { }

  storeListColumns: string[] = [
    "storeName",
    "storeOwner",
    "orderNumber",
    "accountManager",
    "assignedTo",
  ];

  ngOnInit() {
    this.commonService.setPageHeader("Store Request")
    this.commonService.setChangesSavedValue(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.createStoreRequestForm();
    this.getInstituitionTypes();
    this.getMarketGroupList();
    this.getTeamStore(this.teamStoreId);
    this.createOrganizationForm();
    this.getStates();
    this.getAllDepartments();
  }

  createStoreRequestForm() {
    //creates form for entering teamstore data.
    this.storeRequestForm = this.formBuilder.group({
      id: 0,
      stage: 4,
      assignedToId: this.user.na,
      name: new FormControl("", Validators.required),
      isUserExists: false, ///only used in this particular form for validating user-info.
      contactName: new FormControl(""),
      emailId: new FormControl("", Validators.pattern(this.emailPattern)),
      phoneNumber: new FormControl("", Validators.pattern(this.phonePattern)),
      organizationName: new FormControl("", Validators.required),
      organizationAddress: new FormControl({ value: "", disabled: true }),
      openDate: new FormControl(this.datesAllowed.openDate.value),
      productsInHandBy: new FormControl(null),
      productShippedBy: new FormControl(
        this.datesAllowed.productShippedBy.value
      ),
      closeDate: new FormControl(this.datesAllowed.closeDate.value),
      club: new FormControl(""),
      shippingPreference: new FormControl(""),
      proposedIndividualShippingCharge: new FormControl(9.99, [
        Validators.required,
        Validators.min(5),
      ]),
      shipToAddress: new FormControl(""),
      rebateCheckAddress: new FormControl(""),
      fundRaisingClaimPreference: new FormControl(""),
      storeClosureMode: new FormControl(""),
      availableToCopy: new FormControl(false),
      contactMe: false,
      marketId: new FormControl("", Validators.required),
      marketGroupId: new FormControl("", Validators.required),
    });

    // this.storeRequestForm.disable()
  }

  getInstituitionTypes() {
    //fetches instituition types.
    this.sharedService.getInstituitionTypes().subscribe((response) => {
      this.instituitionArray = response.data;
    });
  }
  getMarketList(id) {
    //fetches market list according to market group id.
    this.sharedService.getMarkets(id).subscribe((response) => {
      this.marketArray = response.data;
    });
  }
  getMarketGroupList() {
    //fetches market group list.
    this.sharedService.getMarketGroups().subscribe((response) => {
      this.marketGroupArray = response.data;
    });
  }

  getTeamStore(teamStoreId) {
    //fetches teamstore data and binds it to the form.
    this.commonService.toggleLoading(true)
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe(
      (response) => {
        this.commonService.toggleLoading(false)
        this.teamStore = response.data;

        this.storeRequestForm.setValue({
          id: this.teamStore.id,
          stage: this.teamStore.stage,
          assignedToId: this.user.id,
          name: this.teamStore.name,
          isUserExists: false, //only used in this particular form for validating user-info.
          contactName: this.teamStore.contactName,
          emailId: this.teamStore.emailId,
          phoneNumber: this.teamStore.phoneNumber,
          organizationName: this.teamStore.organizationName,
          organizationAddress: this.teamStore.organizationAddress,
          openDate: this.setDateToDatepicker(this.teamStore.openDate),
          productsInHandBy: this.teamStore.productsInHandBy,
          productShippedBy: this.setDateToDatepicker(
            this.teamStore.productShippedBy
          ),
          closeDate: this.setDateToDatepicker(this.teamStore.closeDate),
          club: parseInt(this.teamStore.club),
          shippingPreference: this.teamStore.shippingPreference,
          proposedIndividualShippingCharge:
            this.teamStore.estimatedIndividualShippingCharge ||
            this.teamStore.proposedIndividualShippingCharge ||
            9.99,
          shipToAddress: this.teamStore.shipToAddress,
          rebateCheckAddress: this.teamStore.rebateCheckAddress,
          fundRaisingClaimPreference: this.teamStore.fundRaisingClaimPreference,
          storeClosureMode: this.teamStore.storeClosureMode,
          availableToCopy: this.teamStore.availableToCopy,
          contactMe: this.teamStore.contactMe,
          marketId: this.teamStore.marketId,
          marketGroupId: this.teamStore.marketGroupId,
        });

        this.fundRaisingClaimValue = this.teamStore.fundRaisingClaimPreference;
        this.storeClosureValue = this.teamStore.storeClosureMode;
        this.shippingPreference = this.teamStore.shippingPreference;
        this.teamStoreObj = [
          {
            storeName: this.teamStore.name,
            storeOwner: this.teamStore.contactName,
            orderNumber: this.teamStore.id,
            accountManager: this.teamStore.createdBy.name,
            assignedTo: this.teamStore.assignedToName,
          },
        ];
        this.dataSource = this.teamStoreObj;

        this.getOrganization();
        this.getMarketList(this.teamStore.marketGroupId);
        // this.updateDatesAllowed();
        this.onKeyUpOfPhone();
      },
      (error) => {
        this.commonService.toggleLoading(false)
        this.commonService.openErrorSnackBar(error.message, "");
      }
    );
  }

  setDateToDatepicker(date: any) {
    //converts selected date-time to required format dd/MM/yyyy hh:mm:ss.
    if (date) return moment(date, "MM/DD/YYYY hh:mm:ss");
    else return null;
  }

  next() {
    // updates the teamstore and proceeds towards store-specification page
    if (this.storeRequestForm.valid) {
      let datePipe = new DatePipe("en-US");
      this.storeRequestForm.value.openDate = datePipe.transform(
        this.storeRequestForm.get("openDate").value.toDate(),
        "MM/dd/yyyy HH:mm:ss"
      );
      this.storeRequestForm.value.productShippedBy = datePipe.transform(
        this.storeRequestForm.get("productShippedBy").value.toDate(),
        "MM/dd/yyyy"
      );
      this.storeRequestForm.value.closeDate = datePipe.transform(
        this.storeRequestForm.get("closeDate").value.toDate(),
        "MM/dd/yyyy HH:mm:ss"
      );
      if (this.invalidClosingDay()) {
        return;
      }
      this.commonService.toggleLoading(true);
      this.storeService.updateStore(this.storeRequestForm.value).subscribe(
        (response) => {
          this.commonService.toggleLoading(false);
          if (response.status == 1) {
            this.commonService.openSuccessSnackBar(
              "Store updated successfully",
              ""
            );
            this.router.navigateByUrl("storebuilder/storespecification");
          } else {
            this.commonService.openErrorSnackBar(response.message, "");
          }
        },
        (error) => {
          this.commonService.toggleLoading(true);
        }
      );
    } else {
      this.storeRequestForm.markAllAsTouched()
    }
    // this.commonService.setPageHeader('Store Build Request Details - Product and Art Definition');
    // this.router.navigateByUrl('storebuilder/storespecification');
  }

  onOrganizationSelect() {
    //checks whether to create or show corresponding org name and address.
    let selectedOrganizationName =
      this.storeRequestForm.get("organizationName").value;
    if (selectedOrganizationName === "Add" || selectedOrganizationName === "") {
      this.storeRequestForm.get("organizationAddress").reset();
      this.storeRequestForm.get("organizationName").reset();
      this.storeRequestForm.get("club").reset();
      $("#addOrgModal").modal("toggle");
    } else {
      let org = this.organizationArray.find(
        (org) => org.name === selectedOrganizationName
      );
      //  if(org[0].userDepartments !=null && org[0].userDepartments.length >0){
      //   this.departmentArray = org[0].userDepartments;
      //   if(this.storeRequestForm.get('club').value!=null && this.storeRequestForm.get('club').value != '')
      //   this.storeRequestForm.get('club').setValue(parseInt(this.storeRequestForm.get('club').value));
      // }
      // else{
      //   this.getAllDepartments();
      // }
      if(!org) return
      let state = this.getState(org.state) || {}
      this.storeRequestForm
        .get("organizationAddress")
        .setValue(
          org.address +
          ", " +
          org.city +
          ", " +
          (state.name||'') +
          ", " +
          org.zip
        );
        this.shippingPreferenceSelected()
    }
  }

  getState(id) {
    return this.stateArray.find((state) => state.id == id);
  }

  getAllDepartments() {
    this.endUserService.getAllUserDepartments().subscribe((response) => {
      if (response.data != null) {
        this.departmentArray = response.data;
      } else {
      }
    });
  }

  getStates() {
    this.endUserService.getAllStates().subscribe((response) => {
      if (response.data != null) {
        this.stateArray = response.data;
      } else {
      }
    });
  }

  createNewOrganization() {
    //creates a new organization.
    this.organizationForm.get("userId").setValue(this.userInfo.id || 0);
    if (this.organizationForm.valid) {
      this.commonService.toggleLoading(true)
      this.endUserService
        .createOrganization(this.organizationForm.value) //,this.organizationAddress
        .subscribe(
          (response) => {
            if (response.status == 1) {
              let obj = response.data;
              this.organizationArray.push(obj);
              this.closeOrganiztionModal();
              let form = document.getElementById(
                "organizationForm"
              ) as HTMLFormElement;
              form.classList.remove("was-validated");
              this.storeRequestForm.get("organizationName").setValue(obj.name);
              this.onOrganizationSelect();
            }
            this.commonService.toggleLoading(false)
          },
          (error) => {
            this.commonService.toggleLoading(false)
            this.commonService.openErrorSnackBar(error.message, "");
          }
        );
    } else {
      let form = document.getElementById("organizationForm") as HTMLFormElement;
      form.classList.add("was-validated");
      this.commonService.openErrorSnackBar(
        "Please enter all required values",
        ""
      );
    }
  }

  // checkForUserInfo() {
  //   //fetching user info using the email provided.
  //   if (this.email != this.storeRequestForm.get("emailId").value) {
  //     this.email = this.storeRequestForm.get("emailId").value;
  //     this.endUserService
  //       .getUserInfoUsingEmaiId(this.email)
  //       .subscribe((response) => {
  //         if (response.data != null) {
  //           this.userInfo = response.data;
  //           this.organizationArray = this.userInfo.organizations;
  //           this.storeRequestForm.get("isUserExists").setValue(true);
  //         } else {
  //           this.storeRequestForm.get("isUserExists").setValue(false);
  //         }
  //       });
  //   }
  // }

  checkForUserInfo() {
    //fetching user info using the email provided.
    let email = this.storeRequestForm.get('emailId').value;
    this.endUserService.getUserInfoUsingEmaiId(email).subscribe(response => {
      if (response.data != null) {
        this.userInfo = response.data;
        this.storeRequestForm.get('isUserExists').setValue(true);
        this.fillUserInfoModal(this.userInfo);
      } else {
        this.storeRequestForm.get('isUserExists').setValue(false);
      }
    }, error => {
      this.resetUserData()
    });
  }

  fillUserInfoModal(user: any) {
    //fills the modal with user info fetched using email.
    if (user != null) {
      $('#name').val(user.name);
      $('#phone').val(user.phoneNumber);
      $('#email').val(user.email);
      $('#userInfoModal').modal('toggle');
    }
  }

  resetUserData(clearEmail?) {
    if (clearEmail)
      this.storeRequestForm.get('emailId').setValue('');
    this.storeRequestForm.get('contactName').setValue('');
    this.storeRequestForm.get('phoneNumber').setValue('');
    // this.storeRequestForm.get('teamStoreOwnerId').setValue(0);
    this.storeRequestForm.get('organizationName').setValue('');
    this.organizationArray = []
  }

  createOrganizationForm() {
    this.organizationForm = this.formBuilder.group({
      name: ["", Validators.required],
      address: ["", Validators.required],
      address1: [""],
      city: ["", Validators.required],
      state: ["", Validators.required],
      zip: ["", Validators.required],
      institutionTypeId: ["", Validators.required],
      userId: 0,
    });
  }

  fillFormWithVerifiedUserData() {
    //after verification by the user the form is filled with the user info fetched using email.
    this.organizationArray = this.userInfo.organizations;
    this.storeRequestForm.get('emailId').setValue(this.userInfo.email);
    this.storeRequestForm.get('contactName').setValue(this.userInfo.name);
    this.storeRequestForm.get('phoneNumber').setValue(this.userInfo.phoneNumber);
    // this.storeRequestForm.get('teamStoreOwnerId').setValue(this.userInfo.id);
    this.onKeyUpOfPhone()
    $('#userInfoModal').modal('toggle');
  }

  closeOrganiztionModal() {
    let form = document.getElementById("organizationForm") as HTMLFormElement;
    form.classList.remove("was-validated");
    $("#addOrgModal").modal("hide");
    this.createOrganizationForm();
  }

  getOrganization() {
    let email = this.storeRequestForm.get("emailId").value;
    this.endUserService.getUserInfoUsingEmaiId(email).subscribe((response) => {
      if (response.data != null) {
        this.userInfo = response.data;
        this.organizationArray = this.userInfo.organizations;
        let org = this.organizationArray.find(
          (org) =>
            org.name == this.storeRequestForm.get("organizationName").value
        );
        // if(org[0].userDepartments !=null && org[0].userDepartments.length >0){
        //   this.departmentArray = org[0].userDepartments;
        //   if(this.storeRequestForm.get('club').value!=null && this.storeRequestForm.get('club').value != '')
        //   this.storeRequestForm.get('club').setValue(parseInt(this.storeRequestForm.get('club').value));
        // }
        // else{
        //   this.getAllDepartments();
        // }
        // if(!org) return
        // let state = this.getState(org.state) || {}
        // this.storeRequestForm
        //   .get("organizationAddress")
        //   .setValue(
        //     org.address +
        //     ", " +
        //     org.city +
        //     ", " +
        //     (state.name || '') +
        //     ", " +
        //     org.zip
        //   );
      }
    });
  }

  shippingPreferenceSelected() {
    // if (this.storeRequestForm.get("shippingPreference").value != 1) {
      this.storeRequestForm.controls["shipToAddress"].setValue(
        this.storeRequestForm.controls["organizationAddress"].value
      );
      this.storeRequestForm.controls["shipToAddress"].updateValueAndValidity();
    // }
  }

  // updateDatesAllowed() {
  //   this.datesAllowed.closeDate.minDate = moment(
  //     this.storeRequestForm.get("openDate").value
  //   )
  //     .add(2, "weeks")
  //     .startOf("day");
  //   this.datesAllowed.productShippedBy.minDate = moment(
  //     this.storeRequestForm.get("closeDate").value
  //   )
  //     .add(3, "weeks")
  //     .startOf("day");
  //   this.storeRequestForm.get("closeDate").markAllAsTouched();
  //   this.storeRequestForm.get("productShippedBy").markAllAsTouched();
  // }

  invalidClosingDay() {
    // return true if day is friday or saturday
    let date = this.storeRequestForm.get("closeDate").value;
    if (moment(date).day() >= 5) {
      this.commonService.openWarningSnackBar(
        "Close Date cannot be Friday or Saturday",
        ""
      );
      this.storeRequestForm.controls.closeDate.setErrors({ invalidDay: true });
      return true;
    } else {
      return false;
    }
  }

  onMarketGroupSelected() {
    let selectedMarketGroupId =
      this.storeRequestForm.get("marketGroupId").value;
    if (selectedMarketGroupId !== 0 && selectedMarketGroupId !== null) {
      this.getMarketList(selectedMarketGroupId);
    }
    this.storeRequestForm.get('marketId').reset()
  }

  onOpenDateChange() {
    let minDate = moment(this.storeRequestForm.get("openDate").value)
      .add(2, "weeks")
      .startOf("day");
    if (minDate.day() == 5) {
      minDate.add(2, "days");
    } else if (minDate.day() == 6) {
      minDate.add(1, "days");
    }

    this.datesAllowed.closeDate.value = minDate.endOf('day')
    this.datesAllowed.openDate.value = this.storeRequestForm.get("openDate").value
    this.datesAllowed.closeDate.minDate = this.datesAllowed.openDate.value
    this.storeRequestForm.get("closeDate").setValue(this.datesAllowed.closeDate.value);
    this.onCloseDateChange();
  }

  onCloseDateChange() {
    this.datesAllowed.productShippedBy.value = moment(
      this.storeRequestForm.get("closeDate").value
    )
      .add(3, "weeks")
      .startOf("day");
    this.storeRequestForm
      .get("productShippedBy")
      .setValue(this.datesAllowed.productShippedBy.value);
  }

  onKeyUpOfPhone(event?) {
    const ignoreKeys = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "ArrowDown",
      "ArrowUp",
      "Delete",
      "Tab",
    ];
    if (event && ignoreKeys.includes(event.key)) return;
    const regEx = /([^0-9])/g;
    let phoneString = this.storeRequestForm.get("phoneNumber").value;
    phoneString = phoneString.replace(regEx, "");
    let newPhoneString = "";
    if (phoneString.length > 0)
      newPhoneString += "(" + phoneString.substr(0, 3);
    if (phoneString.length > 3)
      newPhoneString += ") " + phoneString.substr(3, 3);
    if (phoneString.length > 6)
      newPhoneString += "-" + phoneString.substr(6, 4);
    this.storeRequestForm.get("phoneNumber").setValue(newPhoneString);
  }

  onKeyDownOfPhone(event) {
    const ignoreKeys = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "ArrowDown",
      "ArrowUp",
      "Delete",
      "Tab",
    ];
    if (event.key == " ") return false;
    else if (ignoreKeys.includes(event.key)) return true;
    else if (this.storeRequestForm.get("phoneNumber").value.length >= 14)
      return false;
    for (let i = 0; i < 10; i++) {
      if (i == event.key) return true;
    }
    return false;
  }
}
