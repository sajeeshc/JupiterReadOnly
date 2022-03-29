import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { MatRadioModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { EnduserService } from 'src/app/core/services/enduser.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

let moment = require('moment');
declare var $: any;

@Component({
  selector: 'app-store-request',
  templateUrl: './store-request.component.html',
  styleUrls: ['./store-request.component.scss']
})
export class StorerequestComponent implements OnInit {
  teamStoreId: any;
  type: any;
  loading: boolean;
  teamStore: any;
  dataSource: any;
  storeRequestForm: FormGroup;
  organizationForm: FormGroup
  matRadioModule: MatRadioModule
  fundRaisingClaimValue: string = "1";
  storeClosureValue: string = "1";
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public phonePattern = "^\\([0-9]{3}\\)\\s[0-9]{3}\\-[0-9]{4}$";
  minDate = new Date();
  organizationArray: any[] = [];
  organization: any;
  organisationObj: any;
  organizationAddress: any;
  userInfo: any = {}
  email: string;
  departmentArray: any[] = [];
  stateArray: any[] = [];
  isTemplate
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

  storeListColumns: string[] = ['storeName', 'storeOwner', 'orderNumber', 'accountManager', 'assignedTo'];

  ngOnInit() {
    // this.commonService.setChangesSavedValue(false);
    this.commonService.setPageHeader("Store Request")
    this.createStoreRequestForm();
    this.route.paramMap.subscribe(params => {
      this.teamStoreId = params.get('teamStoreId');
      this.type = params.get('type')
      this.isTemplate = params.get('isTemplate')
    });

    this.getInstituitionTypes();
    this.getMarketGroupList();

    if (this.checkForTeamStoreId()) {
      this.getTeamStore(this.teamStoreId);
    }
    this.createOrganizationForm()
    this.getStates();
    this.getAllDepartments();
  }


  createStoreRequestForm() {
    //creates a form for entering teamstore data.
    this.storeRequestForm = this.formBuilder.group({
      id: 0,
      stage: 1,
      createType: 4,
      isUserExists: false,///only used in this particular form for validating user-info.
      name: new FormControl('', Validators.required),
      contactName: new FormControl('', Validators.required),
      emailId: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      phoneNumber: new FormControl('', Validators.pattern(this.phonePattern)),
      organizationName: new FormControl('', Validators.required),
      organizationAddress: new FormControl(''),
      openDate: new FormControl(this.datesAllowed.openDate.value, Validators.required),
      productShippedBy: new FormControl(this.datesAllowed.productShippedBy.value, Validators.required),
      productsInHandBy: new FormControl(null),
      closeDate: new FormControl(this.datesAllowed.closeDate.value, Validators.required),
      club: new FormControl(''),
      shippingPreference: new FormControl(1, Validators.required),
      proposedIndividualShippingCharge: new FormControl(9.99, [Validators.required, Validators.min(5)]),
      shipToAddress: new FormControl(''),
      rebateCheckAddress: new FormControl(''),
      fundRaisingClaimPreference: new FormControl(2),
      storeClosureMode: new FormControl(1),
      availableToCopy: new FormControl(false),
      teamStoreOwnerId: new FormControl(0),
      contactMe: false,
      marketId: new FormControl('', Validators.required),
      marketGroupId: new FormControl('', Validators.required)
    });
  }

  getInstituitionTypes() {
    //fetches instituition types.
    this.sharedService.getInstituitionTypes().subscribe(response => {
      this.instituitionArray = response.data;
    });
  }
  getMarketList(id) {
    //fetches market list according to market group id.
    this.sharedService.getMarkets(id).subscribe(response => {
      this.marketArray = response.data;
    });
  }
  getMarketGroupList() {
    //fetches market group list.
    this.sharedService.getMarketGroups().subscribe(response => {
      this.marketGroupArray = response.data;
    });
  }


  getTeamStore(teamStoreId) {
    //fetches teamstore data and binds it to the form.
    this.commonService.toggleLoading(true)
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe(response => {
      this.commonService.toggleLoading(false)
      this.teamStore = response.data;
      if (this.isTemplate) {
        this.teamStore.contactName = ''
        this.teamStore.emailId = ''
        this.teamStore.phoneNumber = ''
        this.teamStore.organizationName = ''
        this.teamStore.organizationAddress = ''
        this.teamStore.openDate = this.datesAllowed.openDate.value
        this.teamStore.productsInHandBy = null
        this.teamStore.productShippedBy = this.datesAllowed.productShippedBy.value
        this.teamStore.closeDate = this.datesAllowed.closeDate.value
      }
      this.storeRequestForm.setValue({
        id: this.teamStore.id,
        stage: this.teamStore.stage,
        createType: 1,
        isUserExists: false,///only used in this particular form for validating user-info.
        name: this.teamStore.name,
        contactName: this.teamStore.contactName,
        emailId: this.teamStore.emailId,
        phoneNumber: this.teamStore.phoneNumber,
        organizationName: this.teamStore.organizationName,
        organizationAddress: this.teamStore.organizationAddress,
        openDate: this.setDateToDatepicker(this.teamStore.openDate),
        productsInHandBy: this.teamStore.productsInHandBy,
        productShippedBy: this.setDateToDatepicker(this.teamStore.productShippedBy),
        closeDate: this.setDateToDatepicker(this.teamStore.closeDate),
        club: parseInt(this.teamStore.club),
        shippingPreference: this.teamStore.shippingPreference,
        proposedIndividualShippingCharge: (this.teamStore.estimatedIndividualShippingCharge || this.teamStore.proposedIndividualShippingCharge || 9.99),
        shipToAddress: this.teamStore.shipToAddress,
        rebateCheckAddress: this.teamStore.rebateCheckAddress,
        fundRaisingClaimPreference: this.teamStore.fundRaisingClaimPreference,
        storeClosureMode: this.teamStore.storeClosureMode,
        availableToCopy: this.teamStore.availableToCopy,
        teamStoreOwnerId: 0,
        contactMe: this.teamStore.contactMe,
        marketId: this.teamStore.marketId,
        marketGroupId: this.teamStore.marketGroupId
      });
      this.getOrganization();
      this.fundRaisingClaimValue = this.teamStore.fundRaisingClaimPreference;
      this.storeClosureValue = this.teamStore.storeClosureMode;
      this.teamStoreObj = [
        { storeName: this.teamStore.name, storeOwner: this.teamStore.contactName, orderNumber: this.teamStore.id, accountManager: this.teamStore.createdBy.name, assignedTo: "lloyd Xavier" }
      ];
      this.dataSource = this.teamStoreObj;
      this.getMarketList(this.teamStore.marketGroupId);
      this.onKeyUpOfPhone()
      // this.updateDatesAllowed();
    },
      error => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
  }

  getStates() {
    this.endUserService.getAllStates().subscribe(response => {
      if (response.data != null) {
        this.stateArray = response.data;
      }
    });
  }

  getAllDepartments() {
    this.endUserService.getAllUserDepartments().subscribe(response => {
      if (response.data != null) {
        this.departmentArray = response.data;
      }
    });
  }

  checkForTeamStoreId() {
    //checks whether teamstoreId is available or not
    if (this.teamStoreId != null && this.teamStoreId != undefined && this.teamStoreId != 0) {
      return true;
    }
    return false;
  }

  onMarketGroupSelected() {
    let selectedMarketGroupId = this.storeRequestForm.get('marketGroupId').value;
    if (selectedMarketGroupId !== 0 && selectedMarketGroupId !== null) {
      this.getMarketList(selectedMarketGroupId);
    }
    this.storeRequestForm.get('marketId').reset()
  }


  setDateToDatepicker(date: any) {
    //converts selected date-time to required format dd/MM/yyyy hh:mm:ss.
    return moment(date, "MM/DD/YYYY hh:mm:ss");
  }

  next() {
    // updates or creates a teamstore and proceeds towards store-specification page.
    let datePipe = new DatePipe('en-US');
    this.storeRequestForm.value.openDate = datePipe.transform(this.storeRequestForm.get('openDate').value.toDate(), 'MM/dd/yyyy HH:mm:ss');
    this.storeRequestForm.value.productShippedBy = datePipe.transform(this.storeRequestForm.get('productShippedBy').value.toDate(), 'MM/dd/yyyy');
    this.storeRequestForm.value.closeDate = datePipe.transform(this.storeRequestForm.get('closeDate').value.toDate(), 'MM/dd/yyyy HH:mm:ss');
    if (this.invalidClosingDay()) {
      return
    }
    if (this.type == 2 || this.type == 0) {
      if (this.storeRequestForm.valid) {
        if (this.storeRequestForm.value.stage == 2)
          this.storeRequestForm.get('stage').setValue(1)
        this.commonService.toggleLoading(true)
        this.storeService.updateStore(this.storeRequestForm.value).subscribe(
          (response) => {
            this.commonService.toggleLoading(false)
            if (response.status == 1) {
              this.commonService.openSuccessSnackBar(response.message, "");
              localStorage.setItem('teamStoreId', response.data.id);
              this.commonService.setPageHeader('Store Request - Product & Art Definition');
              if (this.type == 2)
                this.router.navigateByUrl('storemanager/updateStoreRequest/' + 2);
              else
                this.router.navigateByUrl('storemanager/verifystorespecification/' + 0);

            }
            else {
              this.commonService.openErrorSnackBar(response.message, "");
            }
          },
          (error) => {
            this.commonService.toggleLoading(false)
          }
        );
      } else {
        this.storeRequestForm.markAllAsTouched()
      }
    } else {
      if (this.storeRequestForm.valid) {

        // if (this.checkForTeamStoreId()) {
        //   localStorage.setItem('teamStoreId', this.teamStoreId);
        //   this.commonService.setPageHeader('Create Store Request - Product & Art Definition');
        //   this.router.navigateByUrl('storemanager/verifystorespecification/' + 0);
        // }
        // else {

        this.commonService.toggleLoading(true)
        this.storeService.createStore(this.storeRequestForm.value).subscribe(
          (response) => {
            this.commonService.toggleLoading(false)
            if (response.status == 1) {
              this.commonService.openSuccessSnackBar(response.message, "");
              localStorage.setItem('teamStoreId', response.data.id);
              this.commonService.setPageHeader('Store Request - Product & Art Definition');
              this.router.navigateByUrl('storemanager/storespecification/' + 1);
            }
            else {
              this.commonService.openErrorSnackBar(response.message, "");
            }
          },
          (error) => {
            this.commonService.toggleLoading(false)
          }
        );
        // }
      } else {
        this.storeRequestForm.markAllAsTouched()
      }
    }

  }
  teamStoreObj: any[];

  shippingPreferenceSelected() {
    //sets validations on shipping input controls according to the user.
    // if (this.storeRequestForm.get('shippingPreference').value == 1) {
    //   this.storeRequestForm.controls['shipToAddress'].clearValidators();
    //   this.storeRequestForm.controls['shipToAddress'].updateValueAndValidity();
    // } else {
    //   this.storeRequestForm.controls['shipToAddress'].setValidators([Validators.required]);
      this.storeRequestForm.controls['shipToAddress'].setValue(this.storeRequestForm.controls['organizationAddress'].value)
      this.storeRequestForm.controls['shipToAddress'].updateValueAndValidity();
    // }
  }

  fundRaisingClaimValueSelected() {
    //sets validations on rebate address input controls according to the user.
    if (this.storeRequestForm.get('fundRaisingClaimPreference').value == 1) {
      this.storeRequestForm.controls['rebateCheckAddress'].setValidators([Validators.required]);
      this.storeRequestForm.controls['rebateCheckAddress'].updateValueAndValidity();
    } else {
      this.storeRequestForm.controls['rebateCheckAddress'].clearValidators();
      this.storeRequestForm.controls['rebateCheckAddress'].updateValueAndValidity();
    }
  }

  onOrganizationSelect() {
    //checks whether to create or show corresponding org name and address.
    let selectedOrganizationName = this.storeRequestForm.get('organizationName').value;
    if (selectedOrganizationName === 'Add' || selectedOrganizationName === "") {
      this.storeRequestForm.get('organizationAddress').reset();
      this.storeRequestForm.get('organizationName').reset();
      this.storeRequestForm.get('club').reset();
      $('#addOrgModal').modal('toggle');
    }
    else {
      let org = this.organizationArray.find(
        org => org.name === selectedOrganizationName);
      // if(org[0].userDepartments !=null && org[0].userDepartments.length >0){
      //   this.departmentArray = org[0].userDepartments;
      //   if(this.storeRequestForm.get('club').value!=null && this.storeRequestForm.get('club').value != '')
      //   this.storeRequestForm.get('club').setValue(parseInt(this.storeRequestForm.get('club').value));
      // }
      // else{
      //   this.getAllDepartments();
      // }
      let state = this.getState(org.state) || {}
      this.storeRequestForm.get('organizationAddress')
        .setValue(org.address + ", " + org.city + ", " + (state.name || '') + ", " + org.zip);
        this.shippingPreferenceSelected()
    }

  }

  getState(id) {
    return this.stateArray.find(state => state.id == Number(id))
  }

  addOrganization() {
    //collects data for creating new organisation and proceeds to create a organisation.
    if (this.organization != null && this.organization !=
      '' && this.organizationAddress != null && this.organizationAddress != '') {
      let isUserInfoAvailable = this.storeRequestForm.get('isUserExists').value;
      if (isUserInfoAvailable) {
        this.createNewOrganization();
      }
      else {
        let orgObj = {
          name: this.organization,
          address: this.organizationAddress
        }
        this.organizationArray.push(orgObj);
      }
      $('#addOrgModal').modal('hide');
    } else {
      this.commonService.openWarningSnackBar('Please enter a organisation name', '');
    }
  }

  createNewOrganization() {
    //creates a new organization.

    this.organizationForm.get("userId").setValue(this.userInfo.id || 0)
    if (this.organizationForm.valid) {
      this.commonService.toggleLoading(true)
      this.endUserService.createOrganization(this.organizationForm.value) //,this.organizationAddress
        .subscribe((response) => {
          this.commonService.toggleLoading(false)
          if (response.status == 1) {
            let obj = response.data;
            this.organizationArray.push(obj);
            this.storeRequestForm.patchValue({
              organizationName: this.organizationForm.controls['name'].value
            });
            this.onOrganizationSelect();
            this.closeOrganiztionModal()
            let form = document.getElementById("organizationForm") as HTMLFormElement
            form.classList.remove('was-validated')
          }

        }, (error) => {
          this.commonService.openErrorSnackBar(error.message, "");
        })
    } else {
      let form = document.getElementById("organizationForm") as HTMLFormElement
      form.classList.add('was-validated')
      this.commonService.openErrorSnackBar("Please enter all required values", "");
    }
  }

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

  getOrganization() {
    let email = this.storeRequestForm.get('emailId').value;
    this.endUserService.getUserInfoUsingEmaiId(email).subscribe(response => {
      if (response.data != null) {
        this.userInfo = response.data;
        this.storeRequestForm.controls['teamStoreOwnerId'].setValue(this.userInfo.id)
        this.organizationArray = this.userInfo.organizations;
        // let orgs = this.organizationArray.filter(org => org.name == this.storeRequestForm.get('organizationName').value);
        // if(org[0].userDepartments !=null && org[0].userDepartments.length >0){
        //   this.departmentArray = org[0].userDepartments;
        //   if(this.storeRequestForm.get('club').value!=null && this.storeRequestForm.get('club').value != '')
        //   this.storeRequestForm.get('club').setValue(parseInt(this.storeRequestForm.get('club').value));
        // }
        // else{
        //   this.getAllDepartments();
        // }
        // if (orgs[0]) {
        //   let state = this.getState(orgs[0].state)
        //   this.storeRequestForm.get('organizationAddress')
        //     .setValue(orgs[0].address + ", " + orgs[0].city + ", " + state.name + ", " + orgs[0].zip);
        // } else {
        //   this.storeRequestForm.get('organizationAddress').setValue('')
        // }
      }
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

  fillFormWithVerifiedUserData() {
    //after verification by the user the form is filled with the user info fetched using email.
    this.organizationArray = this.userInfo.organizations;
    this.storeRequestForm.get('emailId').setValue(this.userInfo.email);
    this.storeRequestForm.get('contactName').setValue(this.userInfo.name);
    this.storeRequestForm.get('phoneNumber').setValue(this.userInfo.phoneNumber);
    this.storeRequestForm.get('teamStoreOwnerId').setValue(this.userInfo.id);
    this.onKeyUpOfPhone()
    $('#userInfoModal').modal('toggle');
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
      name: ['', Validators.required],
      address: ['', Validators.required],
      address1: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      institutionTypeId: ['', Validators.required],
      userId: this.userInfo.id || 0,
    })
  }

  closeOrganiztionModal() {
    let form = document.getElementById("organizationForm") as HTMLFormElement
    form.classList.remove('was-validated')
    $('#addOrgModal').modal('hide')
    this.createOrganizationForm()
  }

  // updateDatesAllowed() {
  //   this.datesAllowed.closeDate.minDate = moment(this.storeRequestForm.get("openDate").value).add(2, 'weeks').startOf('day')
  //   this.datesAllowed.productShippedBy.minDate = moment(this.storeRequestForm.get("closeDate").value).add(3, 'weeks').startOf('day')
  //   this.storeRequestForm.get("openDate").markAsTouched()
  //   this.storeRequestForm.get("closeDate").markAsTouched()
  //   this.storeRequestForm.get("productShippedBy").markAsTouched()
  // }

  invalidClosingDay() {
    // return true if day is friday or saturday
    let date = this.storeRequestForm.controls.closeDate.value
    if (moment(date).day() >= 5) {
      this.storeRequestForm.controls.closeDate.setErrors({ invalidDay: "false" })
      this.commonService.openWarningSnackBar("Close Date cannot be Friday or Saturday", "");
      return true
    } else {
      return false
    }
  }


  onOpenDateChange() {
    let minDate = moment(this.storeRequestForm.get("openDate").value).add(2, 'weeks').startOf('day')
    if (minDate.day() == 5) {
      minDate.add(2, 'days')
    } else if (minDate.day() == 6) {
      minDate.add(1, 'days')
    }
    this.datesAllowed.closeDate.value = minDate.endOf('day')
    this.datesAllowed.openDate.value = this.storeRequestForm.get("openDate").value
    this.datesAllowed.closeDate.minDate = this.datesAllowed.openDate.value
    this.storeRequestForm.get("closeDate").setValue(this.datesAllowed.closeDate.value)
    this.onCloseDateChange()
  }

  onCloseDateChange() {
    this.datesAllowed.productShippedBy.value = moment(this.storeRequestForm.get("closeDate").value).add(3, 'weeks').startOf('day')
    this.storeRequestForm.get("productShippedBy").setValue(this.datesAllowed.productShippedBy.value)
  }

  openStore() {
    if (this.teamStore.storeUrl)
      window.open("/store/" + this.teamStore.storeUrl, "_blank");
    else
      window.open("/store/" + this.teamStoreId, "_blank");

  }

  onKeyUpOfPhone(event?) {
    const ignoreKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Delete', 'Tab']
    if (event && ignoreKeys.includes(event.key))
      return
    const regEx = /([^0-9])/g
    let phoneString = this.storeRequestForm.get('phoneNumber').value
    phoneString = phoneString.replace(regEx, '')
    let newPhoneString = ''
    if (phoneString.length > 0)
      newPhoneString += "(" + phoneString.substr(0, 3)
    if (phoneString.length > 3)
      newPhoneString += ") " + phoneString.substr(3, 3)
    if (phoneString.length > 6)
      newPhoneString += "-" + phoneString.substr(6, 4)
    this.storeRequestForm.get('phoneNumber').setValue(newPhoneString)
  }

  onKeyDownOfPhone(event) {
    const ignoreKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Delete', 'Tab']
    if (event.key == ' ')
      return false
    else if (ignoreKeys.includes(event.key))
      return true
    else if (this.storeRequestForm.get('phoneNumber').value.length >= 14)
      return false
    for (let i = 0; i < 10; i++) {
      if (i == event.key)
        return true
    }
    return false
  }
}
