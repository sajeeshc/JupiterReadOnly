import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-privacy-settings',
  templateUrl: './privacy-settings.component.html',
  styleUrls: ['./privacy-settings.component.scss']
})
export class PrivacySettingsComponent implements OnInit {

  storePrivacyGroup: FormGroup;

  isPrivateBoxVisible: boolean;
  storeId: number
  storePrivacy: number = 0

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private storebuilderService: StorebuilderService,
    private alertService: AlertService,
    private router: Router,
    private commonService : CommonService
  ) { }

  ngOnInit() {
    this.storeId = parseInt(localStorage.getItem("teamStoreId"));
    this.setUpStorePrivacyFormGroup();
    this.changePasswordBoxHidden(true);
    this.getPrivacy()
  }

  setUpStorePrivacyFormGroup() {
    this.storePrivacyGroup = this.formBuilder.group({
      storePrivacy: new FormControl(''),
      password: new FormControl('')
    });
  }

  changePasswordBoxHidden(value: boolean) {
    this.isPrivateBoxVisible = value;
    if(this.isPrivateBoxVisible == false){
      this.storePrivacyGroup.controls['password'].setValidators([Validators.required,Validators.minLength(6)]);
      this.storePrivacyGroup.controls['password'].updateValueAndValidity();
    }
    else{
      this.storePrivacyGroup.controls['password'].clearValidators();
      this.storePrivacyGroup.controls['password'].updateValueAndValidity();
    }
  }

  getPrivacy() {
    this.storebuilderService.getTeamStore(this.storeId).subscribe(
      (response) => {
        this.setPrivacyValues(response.data.privacy)
      },
      (error) => {
        console.log(error)
        this.alertService.error("Unable to get data");
      }
    );
  }

  setPrivacyValues(privacy) {
    if (privacy) {
      this.storePrivacy = privacy.storePrivacy
      this.storePrivacyGroup.setValue({
        storePrivacy: privacy.storePrivacy.toString(),
        password: privacy.password
      })
    } else {
      this.storePrivacyGroup.setValue({
        storePrivacy: "0",
        password: ""
      })
    }
    this.changePasswordBoxHidden(this.storePrivacy == 0)
  }

  submit() {
    if(this.storePrivacyGroup.valid){
      this.storeService.updatePrivacySettings(this.storeId, this.storePrivacyGroup.value).subscribe(
        (response) => {
          if(response.status == 1){
            this.commonService.openSuccessSnackBar(response.message,'');
          this.router.navigateByUrl("/storebuilder/storedetails/storesettings/socialmedia");
  
  
          }else{
            this.commonService.openErrorSnackBar(response.message,'');
          }
        },
        (error) => {
          console.log(error)
          this.alertService.error("Error while updating privacy settings");
        }
      );
    }
    
  }
  
}
