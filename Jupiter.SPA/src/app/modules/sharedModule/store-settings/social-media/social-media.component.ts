import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
import { StoreService } from 'src/app/core/services/store.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {

  socialMediaGroup: FormGroup;
  storeId: number
  
  constructor(
    private formBuilder: FormBuilder,
    private storeBuilderService: StorebuilderService,
    private storeService: StoreService,
    private alertService: AlertService,
    private router: Router,
    private commonService : CommonService
  ) { }

  ngOnInit() {
    this.storeId = parseInt(localStorage.getItem("teamStoreId"));
    this.setUpSocialMediaFormGroup();
    this.getSocialMedia()
  }

  setUpSocialMediaFormGroup() {
    this.socialMediaGroup = this.formBuilder.group({
      displaySocialMediaIcons: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      twitter: new FormControl(''),
      linkedin: new FormControl(''),
      pinterest: new FormControl(''),
      youtube: new FormControl(''),
    });
  }

  getSocialMedia() {
    this.storeBuilderService.getTeamStore(this.storeId).subscribe(
      (response) => {
        this.setSocialMediaValues(response.data)
        // this.alertService.success("Social media updated successfully"); displaySocialMediaIcons
      },
      (error) => {
        console.log(error)
        this.alertService.error("Unable to get data");
      }
    );
  }

  setSocialMediaValues(data) {
    if (data) {
      let values = {
        "displaySocialMediaIcons":false,
        "facebook":"",
        "instagram":"",
        "twitter":"",
        "linkedin":"",
        "pinterest":"",
        "youtube":""
      }
      values["displaySocialMediaIcons"] = data.displaySocialMediaIcons ? data.displaySocialMediaIcons : false
      let socialMediaLinks = data.socialMediaLinks
      if (socialMediaLinks && socialMediaLinks.length) {
        for (let element of socialMediaLinks) {
          switch (element.socialMediaType) {
            case 0:
              values["facebook"] = element.src ? element.src : ''
              break;
            case 1:
              values["instagram"] = element.src ? element.src : ''
              break;
            case 2:
              values["twitter"] = element.src ? element.src : ''
              break;
            case 3:
              values["linkedin"] = element.src ? element.src : ''
              break;
            case 4:
              values["pinterest"] = element.src ? element.src : ''
              break;
            case 5:
              values["youtube"] = element.src ? element.src : ''
              break;
          }
        }
      }
      this.socialMediaGroup.setValue(values)
    }
  }

  submit() {
    const model = {
      "displaySocialMediaIcons": this.socialMediaGroup.get("displaySocialMediaIcons").value,
      "socialMediaLinks": [
        { "socialMediaType": 0, "src": this.socialMediaGroup.get("facebook").value },
        { "socialMediaType": 1, "src": this.socialMediaGroup.get("instagram").value },
        { "socialMediaType": 2, "src": this.socialMediaGroup.get("twitter").value },
        { "socialMediaType": 3, "src": this.socialMediaGroup.get("linkedin").value },
        { "socialMediaType": 4, "src": this.socialMediaGroup.get("pinterest").value },
        { "socialMediaType": 5, "src": this.socialMediaGroup.get("youtube").value },
      ]
    }
    this.storeService.updateSocialMedia(this.storeId, model).subscribe(
      (response) => {
        if(response.status == 1){
          this.commonService.openSuccessSnackBar(response.message,'');
        this.router.navigateByUrl("/storebuilder/storedetails/storesettings/storedisplay");

      
        }else{
          this.commonService.openErrorSnackBar(response.message,'');
        }
      },
      (error) => {
        console.log(error)
        this.alertService.error("Some error occured");
      }
    );
  }
  
}
