import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { add } from 'date-fns';
import { Button } from 'selenium-webdriver';
import { CommonService } from 'src/app/core/services/common.service';
import { EnduserService } from 'src/app/core/services/enduser.service';
import { ProductService } from 'src/app/core/services/product.service';
import { StoreService } from 'src/app/core/services/store.service';
import { UserService } from 'src/app/core/services/user.service';
import { SharedService } from 'src/app/core/services/shared.service';
import Swal from 'sweetalert2'

let moment = require('moment');
declare var $: any;

@Component({
  selector: 'app-request-free-store',
  templateUrl: './request-free-store.component.html',
  styleUrls: ['../end-user.component.scss', './request-free-store.component.scss']
})
export class RequestFreeStoreComponent implements OnInit {
  storeRequestForm: FormGroup;
  organizationForm: FormGroup;
  userId: string;
  token: string;
  loading: boolean;
  data: any = {};
  colorArray: any[] = [];
  organizationArray: any[] = [];
  organization: any;
  organisationObj: any;
  organizationAddress: any;
  currentDate: any;
  logoToUpload: File = null;
  artToUpload: File = null;
  categoryList: any[] = [];
  departmentArray: any[] = [];
  userInfo: any;
  stateArray: any[] = [];
  newOrgArray: any[] = []
  primaryColors: any;
  secondaryColors: any;
  tertiaryColors: any;
  public emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
  public phonePattern= "^\\([0-9]{3}\\)\\s[0-9]{3}\\-[0-9]{4}$"
  storeForArray = [
    { description: 'SCHOOL', value: 'SCHOOL' },
    { description: "TEAM", value: 'TEAM' },
    { description: "BUSINESS", value: 'BUSINESS' },
    { description: "EVENT", value: 'EVENT' },
    { description: "OTHER", value: 'OTHER' }
  ];
  storeIsFor: string[] = []
  institutionTypeArray: any[] = [];
  marketGroupArray: any[] = []

  constructor(private userService: UserService,
    private endUserService: EnduserService,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private commonService: CommonService,
    private productService: ProductService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createStoreRequestForm();
    this.userId = localStorage.getItem('userId');
    this.token = localStorage.getItem('token');
    this.getProfile();
    // this.getAvailableStoreColors();
    this.getProductCategory();
    this.createOrganizationForm()
    this.getOrganization();
    this.getStates();
    this.getAllDepartments()
    this.getColors();
    this.getInstitutionTypes();
    this.getMarketGroups();
  }

  getCurrentDate() {
    //to get current date in mm/dd/yyyy format.
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    this.currentDate = mm + '/' + dd + '/' + yyyy;
  }

  getProfile() {
    //fetches uer details and binds them to the form.
    if (this.token && this.userId) {
      this.userService.getProfileDetails(this.userId.toString(), this.token.toString()).subscribe(response => {
        let userDetails = response.data;
        let name = userDetails.firstName + " " + userDetails.lastName
        this.storeRequestForm.controls['contactName'].setValue(name);
        this.storeRequestForm.controls['emailId'].setValue(userDetails.email);
        this.storeRequestForm.controls['phoneNumber'].setValue(userDetails.phoneNumber);
        this.storeRequestForm.controls['teamStoreOwnerId'].setValue(userDetails.id);
        this.onKeyUpOfPhone()
      }, error => {
        console.log(error);
      })
    }
  }

  saveStoreRequest() {
    //creates a new store with the form data enter by user.
    if (this.storeRequestForm.valid) {
      if (this.storeRequestForm.value.fundRaisingClaimPreference == "") {
        this.storeRequestForm.value.fundRaisingClaimPreference = 1;
      }
      if (this.storeRequestForm.value.storeClosureMode == "") {
        this.storeRequestForm.value.storeClosureMode = 1;
      }
      this.storeRequestForm.controls['createType'].setValue(1);
      this.storeRequestForm.value.openDate = this.formatDate(this.storeRequestForm.controls['openDate'].value)
      this.storeRequestForm.value.productShippedBy = this.formatDate(this.storeRequestForm.controls['productShippedBy'].value)
      this.storeRequestForm.value.closeDate = this.formatDate(this.storeRequestForm.controls['closeDate'].value)
      console.log(JSON.stringify(this.storeRequestForm.value));
      this.storeService.createStore(this.storeRequestForm.value).subscribe(
        (response) => {
          if (response.status == 1) {
            this.commonService.openSuccessSnackBar(response.message, "");
            localStorage.setItem('teamStoreId', response.data.id);
            var data = { replaceHome: true };
            window.parent.postMessage(data, "*");
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
    var formattedDate = this.commonService.getFormattedDate(date);
    return formattedDate;
  }

  createStoreRequestForm() {
    //creates a form for entering teamstore data.
    // this.storeRequestForm.controls["name"].hasError('required') && this.storeRequestForm.controls["name"].touched
    this.storeRequestForm = this.formBuilder.group({
      id: 0,
      createType: new FormControl(1),
      stage: new FormControl(2),
      name: new FormControl('', Validators.required),
      contactName: new FormControl('', Validators.required),
      emailId: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      phoneNumber: new FormControl('', Validators.pattern(this.phonePattern)),
      // color: [''],
      organizationName: new FormControl('', Validators.required),
      organizationAddress: new FormControl(),
      customerNotes: new FormControl(''),
      openDate: this.currentDate,
      productsInHandBy: null,
      productShippedBy: null,
      closeDate: this.currentDate,
      shippingPreference: 1,
      fundRaisingClaimPreference: 2,
      storeClosureMode: 1,
      availableToCopy: true,
      categoryIds: [''],
      club: 0,
      marketId: new FormControl('', [Validators.required, Validators.min(0)]),
      marketGroupId: new FormControl('', [Validators.required, Validators.min(0)]),
      teamStoreOwnerId: new FormControl(0),
      primaryColorId: new FormControl(''),
      secondaryColorId: new FormControl(''),
      tertiaryColorId: new FormControl(''),
      contactMe: new FormControl(false),
      teamStoreFor: new FormControl('')
    });
  }

  getProductCategory() {
    //fetches product category list.
    this.productService.getProductCategory().subscribe(
      (response) => {
        this.categoryList = response.body.data;
      },
      (error) => {

      }
    );
  }

  shippingPreferenceSelected() {
    //sets validations on shipping input controls according to the user.
    if (this.storeRequestForm.get('shippingPreference').value == 1) {
      this.storeRequestForm.controls['shipToAddress'].clearValidators();
      this.storeRequestForm.controls['shipToAddress'].updateValueAndValidity();
    } else {
      this.storeRequestForm.controls['shipToAddress'].setValidators([Validators.required]);
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

  // getAvailableStoreColors() {
  //   //fetches available store colors.
  //   this.storeService.getAvailableStoreColors().subscribe(
  //     (response) => {
  //       this.colorArray = response.data;
  //     },
  //     (error) => {
  //       this.commonService.openErrorSnackBar(error.message, "");
  //     }
  //   );
  // }

  getStates() {
    this.endUserService.getAllStates().subscribe(response => {
      if (response.data != null) {
        this.stateArray = response.data;
      }
      else {
      }
    });
  }

  getColors() {
    this.endUserService.getTeamStoreColors().subscribe(response => {
      if (response.data != null) {
        var colorObj = response.data;
        this.primaryColors = colorObj.primaryColors;
        this.secondaryColors = colorObj.secondaryColors;
        this.tertiaryColors = colorObj.tertiaryColors;
      }
      else {
      }
    });
  }

  createNewOrganization() {
    //creates a new organization.

    if (this.organizationForm.valid) {
      if (this.userId) {
        this.endUserService.createOrganization(this.organizationForm.value)
          .subscribe((response) => {
            if (response.status == 1) {
              var obj = response.data;
              this.organizationArray.push(obj);
              this.closeOrganiztionModal()
              let form = document.getElementById("organizationForm") as HTMLFormElement
              form.classList.remove('was-validated')
              this.storeRequestForm.get("organizationName").setValue(obj.name)
              this.onOrganizationSelect()
            }

          }, (error) => {
            this.commonService.openErrorSnackBar(error.message, "");
          })
      } else {
        this.organizationArray.push(this.organizationForm.value);
        this.newOrgArray.push(this.organizationForm.value);
        this.storeRequestForm.get("organizationName").setValue(this.organizationForm.value.name)
        this.onOrganizationSelect()
        this.closeOrganiztionModal()
        let form = document.getElementById("organizationForm") as HTMLFormElement
        form.classList.remove('was-validated')
      }

    } else {
      let form = document.getElementById("organizationForm") as HTMLFormElement
      form.classList.add('was-validated')
      this.commonService.openErrorSnackBar("Please enter all required values", "");
    }
  }

  onOrganizationSelect() {
    //checks whether to create or show corresponding org name and address.
    var selectedOrganizationName = this.storeRequestForm.get('organizationName').value;
    if (selectedOrganizationName === 'Add' || selectedOrganizationName === "") {
      this.storeRequestForm.get('organizationAddress').reset();
      this.storeRequestForm.get('organizationName').reset();
      this.storeRequestForm.get('marketId').reset();
      this.storeRequestForm.get('marketGroupId').reset();
      $('#addOrgModal').modal('toggle');
      // this.getAllDepartments();
    } else {
      var org = this.organizationArray.filter(
        org => org.name === selectedOrganizationName);
      var state = this.getState(org[0].state)
      this.storeRequestForm.get('organizationAddress')
        .setValue(org[0].address + ", " + org[0].city + ", " + state.name + ", " + org[0].zip);
    }
  }

  getState(id) {
    return this.stateArray.find(state => state.id == Number(id))
  }

  getAllDepartments() {
    this.endUserService.getAllUserDepartments().subscribe(response => {
      if (response.data != null) {
        this.departmentArray = response.data;
      }
    });
  }

  handleImageInput(files: FileList, type: string) {
    //the image uploaded is saved to temp file.
    switch (type) {
      case "logo":
        this.logoToUpload = files.item(0);
        break;
      case "art":
        this.artToUpload = files.item(0);
        break;
    }
  }

  createRequest() {
    if (this.storeRequestForm.valid) {
      //creates a new request for teamstore.
      let submitButton = document.getElementById("submit-btn") as HTMLButtonElement
      submitButton.disabled = true
      const formData = new FormData();
      if (this.logoToUpload != null && this.logoToUpload != undefined) {
        formData.append("logo", this.logoToUpload);
      }
      if (this.artToUpload != null && this.artToUpload != undefined) {
        formData.append("artFile", this.artToUpload);
      }

      if (this.storeRequestForm.value.fundRaisingClaimPreference == "") {
        this.storeRequestForm.value.fundRaisingClaimPreference = 1;
      }
      if (this.storeRequestForm.value.storeClosureMode == "") {
        this.storeRequestForm.value.storeClosureMode = 1;
      }
      this.storeRequestForm.controls['createType'].setValue(1);
      this.storeRequestForm.get("openDate").setValue(moment().add(1, 'days').format("MM/DD/YYYY HH:mm:ss"));
      let closeDate = moment().add(2, 'weeks').add(1, 'days')
      if (closeDate.day() == 6) {
        closeDate.add(1, 'days')
      } else if (closeDate.day() == 5) {
        closeDate.add(2, 'days')
      }
      this.storeRequestForm.get("closeDate").setValue(closeDate.format("MM/DD/YYYY HH:mm:ss"));
      this.storeRequestForm.get("productShippedBy").setValue(moment(this.storeRequestForm.get("closeDate").value).add(3, 'weeks').add(1, 'days').format("MM/DD/YYYY"));

      this.storeRequestForm.get("teamStoreFor").setValue(this.storeIsFor.toString());
      // var org = this.storeRequestForm.get('organizationName').value;
      // this.storeRequestForm.controls['organizationName'].setValue(org.name);
      formData.append(
        "teamStoreJson",
        JSON.stringify(this.storeRequestForm.value)
      );
      formData.append(
        "organizationJson",
        JSON.stringify(this.newOrgArray)
      );

      this.endUserService.createRequest(formData).subscribe(
        (response) => {
          if (response.status == 1) {
            // this.commonService.openSuccessSnackBar(response.message, "");
            this.createStoreRequestForm()
            this.getProfile();
            submitButton.disabled = false
            this.logoToUpload = null;
            this.artToUpload = null;
            Swal.fire({
              title: 'Success!',
              html: '<p>Your store request has been submitted.<br>An Ares Account Manager will contact you shortly.</p>',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(()=>{
              window.parent.postMessage("goto home","*")
            })
          } else {
            // this.commonService.openErrorSnackBar("Some error occurred!", "");
            Swal.fire({
              title: 'Error!',
              text: 'Some error occurred, please try again',
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.storeRequestForm.markAllAsTouched()
      this.commonService.openWarningSnackBar("Please fill all required fields", "");
    }

  }

  getOrganization() {
    if (this.userId) {
      this.endUserService.getUserInfoUsingEmaiId('self').subscribe(response => {
        if (response.data != null) {
          this.userInfo = response.data;
          this.organizationArray = this.userInfo.organizations;
        }
      });
    }
  }

  createOrganizationForm() {
    this.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      institutionTypeId: ['', [Validators.required, Validators.min(0)]],
      address: ['', Validators.required],
      address1: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    })
  }

  closeOrganiztionModal() {
    let form = document.getElementById("organizationForm") as HTMLFormElement
    form.classList.remove('was-validated')
    $('#addOrgModal').modal('hide')
    this.createOrganizationForm()
  }

  onStoreForChange(event) {
    if (event.checked) {
      this.storeIsFor.push(event.source.value)
    } else {
      let index = this.storeIsFor.indexOf(event.source.value);
      if (index !== -1) {
        this.storeIsFor.splice(index, 1);
      }
    }
  }

  getInstitutionTypes() {
    this.sharedService.getInstituitionTypes().subscribe(response => {
      if (response.data != null) {
        this.institutionTypeArray = response.data;
      }
    });
  }

  getMarketGroups() {
    this.sharedService.getMarketAndGroups().subscribe(response => {
      if (response.data != null) {
        this.marketGroupArray = response.data;
      }
    });
  }

  getMarkets(marketGroupId) {
    let marketGrp = this.marketGroupArray.find(grp => grp.id == marketGroupId)
    return marketGrp ? marketGrp.departments : []
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
    else if(this.storeRequestForm.get('phoneNumber').value.length >= 14)
      return false
    for (let i = 0; i < 10; i++) {
      if (i == event.key)
        return true
    }
    return false
  }
}
