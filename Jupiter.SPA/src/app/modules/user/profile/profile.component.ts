import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { parseJSON } from 'date-fns';
import { UserProfile } from 'src/app/core/models/userProfile';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  userProfile: UserProfile;
  userId: String;
  token: String;
  ShowUpdateSuccessMessage: Boolean = false;
  ShowUpdateFailMessage: Boolean = false;
  public listenedUserId: number;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit () {
    // this.userId = this.getCookie("userId");
    // this.token = this.getCookie("token");
    const urlParams = new URLSearchParams(window.location.search);
    //this.userId = urlParams.get('userId');
    //this.token = urlParams.get('token');

    

    this.userProfileForm = this.fb.group({
      id: new FormControl(0),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      phoneNumber: new FormControl(''),
      email: new FormControl(''),
      billingAddress: new FormControl(''),
      billingZipCode: new FormControl(''),
      billingCity: new FormControl(''),
      billingCountry: new FormControl(''),
      shippingAddress: new FormControl(''),
      shippingZipCode: new FormControl(''),
      shippingCity: new FormControl(''),
      shippingCountry: new FormControl('')
    });

    let thisObj= {}= this;
      //Signal te parent
      window.parent.postMessage("loaded", "*")
      // listen for messages from the parent.
      window.addEventListener("message", function (e) {
        thisObj.userId= new String (e.data.userid).toString();
        thisObj.token= new String (e.data.usertoken).toString();
        if(thisObj.userId!==undefined) {
          thisObj.getProfile(thisObj.userId.toString(), thisObj.token.toString());
        }
      }, false)
  }

  getCookie (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  getProfile (userid:string, token: string) {
    this.token= token;
    this.userService.getProfileDetails(userid.toString(), token.toString()).subscribe(response => {
      const res = response.data;
      this.userProfileForm.setValue({
        id: res.id,
        firstName: res.firstName,
        lastName: res.lastName,
        phoneNumber: res.phoneNumber,
        email: res.email,
        billingAddress: res.billingAddress,
        billingZipCode: res.billingZipCode,
        billingCity: res.billingCity,
        billingCountry: res.billingCountry,
        shippingAddress: res.shippingAddress,
        shippingZipCode: res.shippingZipCode,
        shippingCity: res.shippingCity,
        shippingCountry: res.shippingCountry,
      });
    }, error => {
      console.log(error);
    })
  }

  updateUserProfile(){
    this.userService.updateProfileDetails(this.userProfileForm.value, this.token).subscribe(() => {
      this.ShowUpdateSuccessMessage = true;
      this.ShowUpdateFailMessage = false;
    }, error => {
      this.ShowUpdateSuccessMessage = false;
      this.ShowUpdateFailMessage = true;
    });
  }

  back(){
    window.parent.location.href = "http://20.55.200.220";
  }
}
