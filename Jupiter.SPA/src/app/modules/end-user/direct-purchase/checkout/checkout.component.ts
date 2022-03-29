import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { UserService } from 'src/app/core/services/user.service';
import { MatDatepicker } from '@angular/material';
import { EnduserService } from 'src/app/core/services/enduser.service';

declare var $: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['../../end-user.component.scss', './checkout.component.scss']
})

export class CheckoutComponent implements OnInit {

  cartItems: any;
  paymentMethod: number = 0;
  user: any;
  totalAmount: number = 0;
  totalNumberOfProducts: number = 0;
  currentDate = new Date().toLocaleDateString();
  teamStore: any;
  updatedBillingAddress: FormGroup
  updatedShippingAddress: FormGroup
  isShippingAddressSameAsBillingAddress = false
  organizationArray: any
  selectedOrganization: any
  checkoutObj: any;
  states: any[]
  shippingMethods: any = [
    {
      'id': 1,
      'name': 'Overnight',
      'rate': 20
    },
    {
      'id': 2,
      'name': 'Second tier',
      'rate': 10
    }
  ]
  selectedShippingMethod: any
  // billingAddress: any
  // shippingAddress: any
  billingAddress = {
    address: '',
    address1: '',
    city: '',
    state: '',
    zipCode: '',
    isEditable: false
  }
  shippingAddress = {
    address: '',
    address1: '',
    city: '',
    state: '',
    zipCode: '',
    isEditable: false
  }


  constructor(private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private commonService: CommonService,
    private userService: UserService,
    private fb: FormBuilder,
    private endUserService: EnduserService) { }

  ngOnInit() {
    // this.getCartList();
    this.getUserDetails();
    // this.onLaunchHide();
    this.getTeamStore();
    this.createAddressForm();
    this.getOrganizations();
    this.checkoutObj = JSON.parse(localStorage.getItem("checkoutObj"));
    this.getStates()
  }

  // onLaunchHide() {
  //   $('#creditPayment').hide();
  // }

  // getCartList() {
  //   this.storeService.getCartList().subscribe(response => {
  //     this.cartItems = response.data;
  //     // console.log(this.cartItems);
  //     this.calculateTotalAmount();

  //   },
  //     error => {
        // this.commonService.openErrorSnackBar(error.message, "");
  //     });
  // }

  getTeamStore() {
    const teamStoreId = Number(localStorage.getItem("teamStoreId"));
    this.storeService.getStore(teamStoreId).subscribe(response => {
      this.teamStore = response.data;
      // this.setAddress()
    },
      error => {
        console.log(error)
      })
  }

  getUserDetails() {
    var userId = localStorage.getItem('userId');
    var token = localStorage.getItem('token');
    this.userService.getProfileDetails(userId, token).subscribe(response => {
      this.user = response.data;
      this.updateShippingAddressAsBillingAddress(this.user.isSameAsBillingAddress)
      this.setAddress()
    },
      error => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
  }
  // calculateTotalAmount() {
  //   this.cartItems.cartItemsInfo.forEach(item => {
  //     this.totalAmount += item.productPrice;
  //   });
  //   this.totalNumberOfProducts = this.cartItems.cartItemsInfo.length;
  // }

  updateShippingAddressAsBillingAddress(state) {
    this.isShippingAddressSameAsBillingAddress = state
    if (state) {
      this.shippingAddress = { ...this.billingAddress }
      this.shippingAddress['isEditable'] = false
    } else {
      this.shippingAddress = {
        address: this.user.shippingAddress,
        address1: this.user.shippingAddress1,
        city: this.user.shippingCity,
        state: this.user.shippingState,
        zipCode: this.user.shippingZipCode,
        isEditable: true
      }
    }
  }

  createAddressForm() {
    this.updatedBillingAddress = this.fb.group({
      billingAddress: new FormControl(''),
      billingAddress1: new FormControl(''),
      billingCity: new FormControl(''),
      billingState: new FormControl(-1, Validators.min(0)),
      billingZipCode: new FormControl(''),
      updateProfile: new FormControl(false)
    })
    this.updatedShippingAddress = this.fb.group({
      shippingAddress: new FormControl(''),
      shippingAddress1: new FormControl(''),
      shippingCity: new FormControl(''),
      shippingState: new FormControl(-1, Validators.min(0)),
      shippingZipCode: new FormControl(''),
      updateProfile: new FormControl(false)
    })
  }

  updateBillingAddress() {
    let form = document.getElementById("updatedBillingAddressForm") as HTMLFormElement
    if (this.updatedBillingAddress.get("billingState").value == -1) {
      this.updatedBillingAddress.get("billingState").setValue(null)
    }
    if (form.checkValidity()) {
      this.billingAddress = {
        'address': this.updatedBillingAddress.get("billingAddress").value,
        'address1': this.updatedBillingAddress.get("billingAddress1").value,
        'city': this.updatedBillingAddress.get("billingCity").value,
        'state': this.updatedBillingAddress.get("billingState").value,
        'zipCode': this.updatedBillingAddress.get("billingZipCode").value,
        'isEditable': true
      }
      if (this.updatedBillingAddress.get("updateProfile").value) {
        this.user.billingAddress = this.updatedBillingAddress.get("billingAddress").value
        this.user.billingAddress1 = this.updatedBillingAddress.get("billingAddress1").value
        this.user.billingCity = this.updatedBillingAddress.get("billingCity").value
        this.user.billingState = this.updatedBillingAddress.get("billingState").value
        this.user.billingZipCode = this.updatedBillingAddress.get("billingZipCode").value
        this.updateUserProfile()
      }
      this.updateShippingAddressAsBillingAddress(this.isShippingAddressSameAsBillingAddress)
      this.closeModal()
    } else {
      this.commonService.openErrorSnackBar("Fill all values", "")
      form.classList.add('was-validated')
    }
  }

  updateShippingAddress() {
    let form = document.getElementById("updatedShippingAddressForm") as HTMLFormElement
    if (this.updatedShippingAddress.get("shippingState").value == -1) {
      this.updatedShippingAddress.get("shippingState").setValue(null)
    }
    if (form.checkValidity()) {
      this.shippingAddress = {
        'address': this.updatedShippingAddress.get("shippingAddress").value,
        'address1': this.updatedShippingAddress.get("shippingAddress1").value,
        'city': this.updatedShippingAddress.get("shippingCity").value,
        'state': this.updatedShippingAddress.get("shippingState").value,
        'zipCode': this.updatedShippingAddress.get("shippingZipCode").value,
        'isEditable': true
      }
      if (this.updatedShippingAddress.get("updateProfile").value) {
        this.user.shippingAddress = this.updatedShippingAddress.get("shippingAddress").value
        this.user.shippingAddress1 = this.updatedShippingAddress.get("shippingAddress1").value
        this.user.shippingCity = this.updatedShippingAddress.get("shippingCity").value
        this.user.shippingState = this.updatedShippingAddress.get("shippingState").value
        this.user.shippingZipCode = this.updatedShippingAddress.get("shippingZipCode").value
        this.updateUserProfile()
      }
      this.closeModal()
    } else {
      this.commonService.openErrorSnackBar("Fill all values", "")
      form.classList.add('was-validated')
    }
  }

  updateUserProfile() {
    const token = localStorage.getItem('token')
    this.userService.updateProfileDetails(this.user, token).subscribe((response: any) => {
      if (response.status == 1) {
        this.commonService.openSuccessSnackBar("User profile updated", "");
      }
    })
  }

  closeModal() {
    $("#billingAddressModal").modal("hide")
    $("#shippingAddressModal").modal("hide")
    $("#updatedShippingAddressForm").removeClass('was-validated')
    $("#updatedBillingAddressForm").removeClass('was-validated')
    this.createAddressForm()
  }

  getOrganizations() {
    this.endUserService.getOrganizations().subscribe((response) => {
      this.organizationArray = response.data;
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    })
  }

  selectOrganization(id) {
    this.selectedOrganization = this.organizationArray.find((el) => {
      return el.id == id
    })
    this.setAddress()
  }

  selectShippingMethod(id) {
    this.selectedShippingMethod = this.shippingMethods.find((el) => {
      return el.id == id
    })
  }

  setAddress() {
    // shipping preference = individual 
    // if (this.teamStore && this.teamStore.shippingPreference === 0) {
    //   // payment method = credit
    //   if (this.paymentMethod === 0) {
    //     this.billingAddress = {
    //       address: this.user.billingAddress,
    //       address1: this.user.billingAddress1,
    //       city: this.user.billingCity,
    //       state: this.user.billingState,
    //       zipCode: this.user.billingZipCode,
    //       isEditable: true
    //     }
    //     if (this.isShippingAddressSameAsBillingAddress) {
    //       this.shippingAddress = {
    //         address: this.user.billingAddress,
    //         address1: this.user.billingAddress1,
    //         city: this.user.billingCity,
    //         state: this.user.billingState,
    //         zipCode: this.user.billingZipCode,
    //         isEditable: false
    //       }
    //     } else {
    //       this.shippingAddress = {
    //         address: this.user.shippingAddress,
    //         address1: this.user.shippingAddress1,
    //         city: this.user.shippingCity,
    //         state: this.user.shippingState,
    //         zipCode: this.user.shippingZipCode,
    //         isEditable: true
    //       }
    //     }
    //     // payment method = invoice
    //   } else if (this.paymentMethod === 1) {
    //     this.shippingAddress = {
    //       address: this.selectedOrganization ? this.selectedOrganization.address : '',
    //       address1: '',
    //       city: '',
    //       state: '',
    //       zipCode: '',
    //       isEditable: false
    //     }
    //     this.billingAddress = {
    //       address: this.selectedOrganization ? this.selectedOrganization.address : '',
    //       address1: '',
    //       city: '',
    //       state: '',
    //       zipCode: '',
    //       isEditable: false
    //     }
    //   }
    //   // shipping freference = bulk
    // } else if (this.teamStore && this.teamStore.shippingPreference === 1) {
    //   // common
    //   this.shippingAddress = {
    //     'address': this.teamStore.shipToAddress,
    //     'address1': '',
    //     'city': '',
    //     'state': '',
    //     'zipCode': '',
    //     'isEditable': false
    //   }
    //   // payment method = credit
    //   if (this.paymentMethod === 0) {
    //     this.billingAddress = {
    //       'address': this.teamStore.shipToAddress,
    //       'address1': '',
    //       'city': '',
    //       'state': '',
    //       'zipCode': '',
    //       'isEditable': false
    //     }
    //     //payment method = invoice 
    //   } else if (this.paymentMethod === 1) {
    //     this.billingAddress = {
    //       'address': this.selectedOrganization ? this.selectedOrganization.address : '',
    //       'address1': '',
    //       'city': '',
    //       'state': '',
    //       'zipCode': '',
    //       'isEditable': false
    //     }
    //   }
    // }

    this.billingAddress = {
      address: this.user.billingAddress,
      address1: this.user.billingAddress1,
      city: this.user.billingCity,
      state: this.user.billingState,
      zipCode: this.user.billingZipCode,
      isEditable: true
    }


    this.shippingAddress = {
      address: this.user.shippingAddress,
      address1: this.user.shippingAddress1,
      city: this.user.shippingCity,
      state: this.user.shippingState,
      zipCode: this.user.shippingZipCode,
      isEditable: true
    }
  }

  checkout() {
    if(this.billingAddress.address == null || this.billingAddress.address.length < 0){
      this.commonService.openWarningSnackBar("Please enter billing address", "");
    }else if(this.shippingAddress.address == null || this.shippingAddress.address.length < 0){
      this.commonService.openWarningSnackBar("Please enter shipping address", "");
    }else{
      this.commonService.openSuccessSnackBar("Validated succesfully", "");
    }



    // this.storeService.checkout(this.checkoutObj).subscribe(
    //   (response) => {
    //     if (response.status == 1) {
    //       this.commonService.openSuccessSnackBar(response.message, "");
    //       // this.router.navigateByUrl('enduser/buyfromlivestore/checkout');
    //     } else {
    //       this.commonService.openErrorSnackBar(response.message, "");
    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  getStates() {
    this.endUserService.getAllStates().subscribe(res => {
      this.states = res.data
    })
  }

}
