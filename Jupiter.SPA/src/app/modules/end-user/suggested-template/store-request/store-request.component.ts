import { Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { EnduserService } from 'src/app/core/services/enduser.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { StoreService } from 'src/app/core/services/store.service';
import { UserService } from 'src/app/core/services/user.service';

let moment = require('moment');
declare var $: any;

@Component({
  selector: 'app-store-request',
  templateUrl: './store-request.component.html',
  styleUrls: ['../../end-user.component.scss', './store-request.component.scss']
})
export class StoreRequestComponent implements OnInit {

  storeRequestForm: FormGroup;
  organizationForm: FormGroup;
  userId: String;
  token: String;
  loading: boolean;
  teamStoreId: any;
  teamStore: any;
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public phonePattern = "[- +()0-9]+";
  minDate = new Date();
  organizationArray: any[] = [];
  organization: any;
  organisationObj: any;
  organizationAddress: any;
  departmentArray: any[] = [];
  userInfo: any;
  stateArray: any[] = [];
  datesAllowed = {
    openDate: {
      minDate: moment().add(1, 'days').startOf('day')
    },
    closeDate: {
      minDate: moment().add(2, 'weeks').add(1, 'days').startOf('day')
    },
    productShippedBy: {
      minDate: moment().add(5, 'weeks').add(1, 'days').startOf('day')
    }
  }
  instituitionArray:any[]=[];
  marketArray:any[]=[];
  marketGroupArray:any[]=[];
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private commonService: CommonService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private endUserService: EnduserService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.activatedroute.paramMap.subscribe(params => {
      this.teamStoreId = params.get('teamStoreId');
    });
    this.createStoreRequestForm();
    this.createOrganizationForm();
    this.getInstituitionTypes();
    this.getMarketGroupList();
    if (this.teamStoreId != null && this.teamStoreId != undefined && this.teamStoreId != 0) {
      this.getTeamStoreData();
    }
    else {
      // const urlParams = new URLSearchParams(window.location.search);
      // let thisObj = {} = this;
      //Signal te parent
      // window.parent.postMessage("loaded", "*")
      // listen for messages from the parent.
      // window.addEventListener("message", function (e) {
      //   thisObj.userId = new String(e.data.userid).toString();
      //   thisObj.token = new String(e.data.usertoken).toString();
      //   if (thisObj.userId !== undefined) {
      //     localStorage.setItem("userId", thisObj.userId.toString());
      //     localStorage.setItem("token", thisObj.token.toString());
      //     thisObj.getProfile(thisObj.userId.toString(), thisObj.token.toString());
      //   }
      // }, false)

      var userId = localStorage.getItem('userId');
      var token = localStorage.getItem('token');
      this.getProfile(userId, token);
    }
    this.getOrganization();
    this.getStates();
    this.getAllDepartments();
  }


  getProfile(userid: string, token: string) {
    //fetches user details.
    this.token = token;
    this.userService.getProfileDetails(userid.toString(), token.toString()).subscribe(response => {
      let userDetails = response.data;
      var name = userDetails.firstName + " " + userDetails.lastName
      this.storeRequestForm.controls['contactName'].setValue(name);
      this.storeRequestForm.controls['emailId'].setValue(userDetails.email);
      this.storeRequestForm.controls['phoneNumber'].setValue(userDetails.phoneNumber);
    }, error => {
    })
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

  // getOrganizations() {
  //fetches organization list of the user.
  //   this.endUserService.getOrganizations().subscribe((response) => {
  //     this.organizationArray = response.data;
  //   }, (error) => {
      // this.commonService.openErrorSnackBar(error.message, "");
  //   })
  // }

  getTeamStoreData() {
    //fetches teamstore data and binds it to the form.
    this.storeService.getStore(this.teamStoreId).subscribe(response => {
      this.teamStore = response.data;
      this.storeRequestForm.setValue({
        id: this.teamStore.id,
        createType: 3,
        stage: 2,
        name: this.teamStore.name,
        contactName: this.teamStore.contactName,
        emailId: this.teamStore.emailId,
        phoneNumber: this.teamStore.phoneNumber,
        organizationName: this.teamStore.organizationName,
        organizationAddress: this.teamStore.organizationAddress,
        openDate: this.datesAllowed.openDate.minDate,
        productShippedBy: this.datesAllowed.productShippedBy.minDate,
        closeDate: this.datesAllowed.closeDate.minDate,
        productsInHandBy: null,
        club: this.teamStore.club,
        shippingPreference: this.teamStore.shippingPreference,
        shipToAddress: '',
        rebateCheckAddress: this.teamStore.rebateCheckAddress,
        fundRaisingClaimPreference: this.teamStore.fundRaisingClaimPreference,
        storeClosureMode: this.teamStore.storeClosureMode,
        availableToCopy: this.teamStore.availableToCopy,
        isUserExists: true,
        contactMe: this.teamStore.contactMe,
        marketId: this.teamStore.marketId,
        marketGroupId: this.teamStore.marketGroupId
      });

      this.getOrganization();
      this.getMarketList(this.teamStore.marketGroupId);
    }, error => {
      console.log(error);
    })
  }

  setDateToDatepicker(date: any) {
    //converts selected date-time to required format dd/mm/yyyy.
    return moment(date, "MM/DD/YYYY HH:mm:ss")
  }

  createStoreRequestForm() {
    //creates form to enter teamstore data.
    this.storeRequestForm = this.formBuilder.group({
      id: 0,
      createType: new FormControl(2),
      stage: new FormControl(2),
      name: new FormControl('', Validators.required),
      contactName: new FormControl('', Validators.required),
      emailId: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      phoneNumber: new FormControl('', [Validators.pattern(this.phonePattern), Validators.minLength(10), Validators.maxLength(10)]),
      organizationName: new FormControl('', Validators.required),
      organizationAddress: new FormControl({ value: '', disabled: true }),
      openDate: new FormControl(this.datesAllowed.openDate.minDate, Validators.required),
      productShippedBy: new FormControl(this.datesAllowed.productShippedBy.minDate, Validators.required),
      closeDate: new FormControl(this.datesAllowed.closeDate.minDate, Validators.required),
      productsInHandBy: new FormControl(null,),
      club: new FormControl(''),
      shippingPreference: new FormControl('', Validators.required),
      shipToAddress: new FormControl(''),
      rebateCheckAddress: new FormControl(''),
      availableToCopy: new FormControl(false),
      fundRaisingClaimPreference: new FormControl(2),
      storeClosureMode: new FormControl(1),
      isUserExists: true,
      contactMe: new FormControl(false),
      marketId: new FormControl('',Validators.required),
      marketGroupId: new FormControl('',Validators.required)
    });
    this.onOpenDateChange()
  }

  saveStoreRequest() {
    //checks whether to update or create teamstore.
    if (this.storeRequestForm.valid) {
      if (this.storeRequestForm.value.fundRaisingClaimPreference == "") {
        this.storeRequestForm.value.fundRaisingClaimPreference = 1;
      }
      if (this.storeRequestForm.value.storeClosureMode == "") {
        this.storeRequestForm.value.storeClosureMode = 1;
      }
      this.storeRequestForm.controls['createType'].setValue(3);
      this.storeRequestForm.value.openDate = this.formatDate(this.storeRequestForm.controls['openDate'].value)
      this.storeRequestForm.value.productShippedBy = moment(this.storeRequestForm.controls['productShippedBy'].value).format("MM/DD/YYYY")
      this.storeRequestForm.value.closeDate = this.formatDate(this.storeRequestForm.controls['closeDate'].value)
      this.saveOrUpdate(this.storeRequestForm.value);
    }

  }

  getOrganization() {
    this.endUserService.getUserInfoUsingEmaiId('self').subscribe(response => {
      if (response.data != null) {
        this.userInfo = response.data;
        this.organizationArray = this.userInfo.organizations;
        // var org = this.organizationArray.filter(org => org.name == this.storeRequestForm.get('organizationName').value);
        // this.departmentArray = org[0].userDepartments;
        // this.storeRequestForm.get('club').setValue(org[0].userDepartments[0].id);
      }
      else {
      }
    });
  }

  saveOrUpdate(modal: any) {
    //creates or updates teamstore.
    if (this.invalidClosingDay()) {
      return
    }
    if (this.teamStoreId != null && this.teamStoreId != undefined && this.teamStoreId != 0) {
      this.storeRequestForm.value.createType = 3;
      this.storeService.updateStore(this.storeRequestForm.value).subscribe(
        (response) => {
          if (response.status == 1) {
            this.commonService.openSuccessSnackBar(response.message, "");
            localStorage.setItem('teamStoreId', response.data.id);
            this.router.navigateByUrl('enduser/suggestedtemplate/storespecification');
          }
          else {
            this.commonService.openErrorSnackBar(response.message, "");
          }
        },
        (error) => {
          this.commonService.openErrorSnackBar(error.message, "");
        }
      );
    } else {
      this.storeRequestForm.value.createType = 2;
      // this.storeRequestForm.addControl('isUserExists',new FormControl);
      // this.storeRequestForm.value.isUserExists = true;
      this.storeService.createStore(this.storeRequestForm.value).subscribe(
        (response) => {
          if (response.status == 1) {
            this.commonService.openSuccessSnackBar(response.message, "");
            localStorage.setItem('teamStoreId', response.data.id);
            this.router.navigateByUrl('enduser/suggestedtemplate/storespecification');
          }
          else {
            this.commonService.openErrorSnackBar(response.message, "");
          }
        },
        (error) => {
          this.commonService.openErrorSnackBar(error.message, "");
        }
      );
    }
  }

  formatDate(date) {
    //for formating date.
    return moment(date).format("MM/DD/YYYY HH:mm:ss");
  }

  shippingPreferenceSelected() {
    //sets validations on shipping input controls according to the user.
    if (this.storeRequestForm.get('shippingPreference').value == 1) {
      this.storeRequestForm.controls['shipToAddress'].clearValidators();
      this.storeRequestForm.controls['shipToAddress'].updateValueAndValidity();
    } else {
      this.storeRequestForm.controls['shipToAddress'].setValidators([Validators.required]);
      this.storeRequestForm.controls['shipToAddress'].setValue(this.storeRequestForm.controls['organizationAddress'].value)
      this.storeRequestForm.controls['shipToAddress'].updateValueAndValidity();
    }
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

  createNewOrganization() {
    //creates a new organisation.
    if (this.organizationForm.valid) {
      this.endUserService.createOrganization(this.organizationForm.value)
        .subscribe((response) => {
          if (response.status == 1) {
            this.organizationArray.push(response.data);
            this.closeOrganiztionModal()
            let form = document.getElementById("organizationForm") as HTMLFormElement
            form.classList.remove('was-validated')
            this.storeRequestForm.get("organizationName").setValue(response.data.name)
            this.onOrganizationSelect()
          }
        }, (error) => {
          this.commonService.openErrorSnackBar(error.message, "");
        })
    } else {
      this.commonService.openErrorSnackBar("Please fill all required values", "");
      let form = document.getElementById("organizationForm") as HTMLFormElement
      form.classList.add('was-validated')
    }
  }

  onMarketGroupSelected(){
    var selectedMarketGroupId = this.storeRequestForm.get('marketGroupId').value;
    if (selectedMarketGroupId !== 0 && selectedMarketGroupId !== null) {
      this.getMarketList(selectedMarketGroupId);
  }
}


  onOrganizationSelect() {
    //checks whether to create or show corresponding org name and address.
    var selectedOrganizationName = this.storeRequestForm.get('organizationName').value;
    if (selectedOrganizationName === 'Add' || selectedOrganizationName === "") {
      this.storeRequestForm.get('organizationAddress').reset();
      this.storeRequestForm.get('organizationName').reset();
      this.storeRequestForm.get('club').reset();
    }
    else {
      var org = this.organizationArray.filter(
        org => org.name === selectedOrganizationName);
      //  if(org[0].userDepartments !=null && org[0].userDepartments.length >0){
      //   this.departmentArray = org[0].userDepartments;
      //   if(this.storeRequestForm.get('club').value!=null && this.storeRequestForm.get('club').value != '')
      //   this.storeRequestForm.get('club').setValue(parseInt(this.storeRequestForm.get('club').value));
      // }
      // else{
      //   this.getAllDepartments();
      // }
      var state = this.getState(org[0].state)
      this.storeRequestForm.get('organizationAddress')
        .setValue(org[0].address + ", " + org[0].city + ", " + state.name + ", " + org[0].zip);
      this.storeRequestForm.controls['shipToAddress'].setValue(this.storeRequestForm.controls['organizationAddress'].value)

    }
  }

  getState(id) {
    return this.stateArray.find(state => state.id == id)
  }

  getAllDepartments() {
    this.endUserService.getAllUserDepartments().subscribe(response => {
      if (response.data != null) {
        this.departmentArray = response.data;
      }
      else {
      }
    });
  }

  getStates() {
    this.endUserService.getAllStates().subscribe(response => {
      if (response.data != null) {
        this.stateArray = response.data;
      }
      else {
      }
    });
  }

  createOrganizationForm() {
    this.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      address1: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      institutionTypeId:['', Validators.required]
    })
  }

  closeOrganiztionModal() {
    let form = document.getElementById("organizationForm") as HTMLFormElement
    form.classList.remove('was-validated')
    $('#addOrgModal').modal('hide')
    this.createOrganizationForm()
  }

  openOrganiztionModal() {
    let form = document.getElementById("organizationForm") as HTMLFormElement
    form.classList.remove('was-validated')
    $('#addOrgModal').modal('show')
  }


  updateDatesAllowed() {
    this.datesAllowed.closeDate.minDate = moment(this.storeRequestForm.get("openDate").value).add(2, 'weeks').startOf('day')
    this.datesAllowed.productShippedBy.minDate = moment(this.storeRequestForm.get("closeDate").value).add(3, 'weeks').startOf('day')
  }

  dayFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Friday and Saturday from being selected.
    return day !== 5 && day !== 6;
  }

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
    this.datesAllowed.closeDate.minDate = minDate
    this.storeRequestForm.get("closeDate").setValue(this.datesAllowed.closeDate.minDate)
    this.onCloseDateChange()
  }

  onCloseDateChange() {
    this.datesAllowed.productShippedBy.minDate = moment(this.storeRequestForm.get("closeDate").value).add(3, 'weeks').startOf('day')
    this.storeRequestForm.get("productShippedBy").setValue(this.datesAllowed.productShippedBy.minDate)
  }

}
