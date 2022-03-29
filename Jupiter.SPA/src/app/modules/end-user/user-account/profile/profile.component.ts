import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { EnduserService } from 'src/app/core/services/enduser.service';
import { UserService } from 'src/app/core/services/user.service';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../../end-user.component.scss', './../user-account.component.scss', './profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userProfileForm: FormGroup;
  userId: String;
  token: String;
  public listenedUserId: number;
  today = new Date()
  stateArray:any[]=[];
  // isShippingAddressSameAsBillingAddress = false

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endUserService:EnduserService
  ) { }

  ngOnInit () {
    this.createProfileForm();
    var userId = localStorage.getItem("userId");
    var token = localStorage.getItem("token");
    this.getProfile(userId, token);
    this.getStates();
    // if ((userId != null && userId != undefined) && (token != null && token != undefined)) {
    //   this.getProfile(userId, token);
    // } else {
    //   let thisObj = {} = this;
      //Signal te parent
      // window.parent.postMessage("loaded", "*")
      // listen for messages from the parent.
    //   window.addEventListener("message", function (e) {
    //     if (thisObj.userId === undefined) {
    //       thisObj.userId = new String(e.data.userid).toString();
    //       thisObj.token = new String(e.data.usertoken).toString();
    //       if (thisObj.userId !== undefined) {
    //         localStorage.setItem("userId", thisObj.userId.toString());
    //         localStorage.setItem("token", thisObj.token.toString());
    //         thisObj.getProfile(thisObj.userId.toString(), thisObj.token.toString());
            
    //       }
    //     }
    //   }, false)
    // }
  }

  createProfileForm () {
    this.userProfileForm = this.fb.group({
      id: new FormControl(0),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      dateofBirth: new FormControl(),
      phoneNumber: new FormControl(''),
      email: new FormControl(''),
      billingAddress: new FormControl(''),
      billingZipCode: new FormControl(''),
      billingState: new FormControl(''),
      billingCity: new FormControl(''),
      billingAddress1: new FormControl(''),
      shippingAddress: new FormControl(''),
      shippingZipCode: new FormControl(''),
      shippingCity: new FormControl(''),
      shippingState: new FormControl(''),
      shippingAddress1: new FormControl(''),
      isSameAsBillingAddress: new FormControl('')
    });
  }

  getProfile (userid: string, token: string) {
    this.userService.getProfileDetails(userid.toString(), token.toString()).subscribe(response => {
      const res = response.data;
      let dob:any = ''
      if(res.dateofBirth){
        dob = new Date(res.dateofBirth)
      }
      this.userProfileForm.setValue({
        id: res.id,
        firstName: res.firstName,
        lastName: res.lastName,
        phoneNumber: res.phoneNumber,
        dateofBirth: dob,
        email: res.email,
        billingAddress: res.billingAddress,
        billingZipCode: res.billingZipCode,
        billingCity: res.billingCity,
        billingState: res.billingState,
        billingAddress1: res.billingAddress1,
        shippingAddress: res.shippingAddress,
        shippingZipCode: res.shippingZipCode,
        shippingCity: res.shippingCity,
        shippingState: res.shippingState,
        shippingAddress1: res.shippingAddress1,
        isSameAsBillingAddress: res.isSameAsBillingAddress
      });
    }, error => {
      console.log(error);
    })
  }

  getStates() {
    this.endUserService.getAllStates().subscribe(response => {
      if (response.data != null) {
        this.stateArray = response.data;
      }
    });
  }

  updateUserProfile () {
      if (this.userProfileForm.value.isSameAsBillingAddress) {
        this.userProfileForm.controls['shippingAddress'].setValue(this.userProfileForm.controls['billingAddress'].value);
        this.userProfileForm.controls['shippingCity'].setValue(this.userProfileForm.controls['billingCity'].value);
        this.userProfileForm.controls['shippingState'].setValue(this.userProfileForm.controls['billingState'].value);
        this.userProfileForm.controls['shippingAddress1'].setValue(this.userProfileForm.controls['billingAddress1'].value);
        this.userProfileForm.controls['shippingZipCode'].setValue(this.userProfileForm.controls['billingZipCode'].value);
      }
    if (this.userProfileForm.valid) {
      let model = { ...this.userProfileForm.value }

      // format DOB as mm/dd/yyyy
      if(this.userProfileForm.value.dateofBirth){
        model.dateofBirth = ('0' + (this.userProfileForm.value.dateofBirth.getMonth() + 1)).slice(-2) + '/' +
        ('0' + this.userProfileForm.value.dateofBirth.getDate()).slice(-2) + '/' +
        this.userProfileForm.value.dateofBirth.getFullYear()  
      }else{
        model.dateofBirth = null
      }
      
      this.userService.updateProfileDetails(model, this.token).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.commonService.openSuccessSnackBar(response.message, "")
        } else {
          this.commonService.openErrorSnackBar(response.message, "")
        }
      }, error => {
        this.commonService.openErrorSnackBar(error.message, "")
      });
    } else {
      this.commonService.openErrorSnackBar("Please fill all required fields", "")
    }

  }

}
