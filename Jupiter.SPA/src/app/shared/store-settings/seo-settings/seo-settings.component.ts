import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-seo-settings',
  templateUrl: './seo-settings.component.html',
  styleUrls: ['./seo-settings.component.scss']
})
export class SeoSettingsComponent implements OnInit {
  seoSettingsGroup: FormGroup;
  seoSettingsObj: any;
  pageSelected: string;
  teamStoreId: number;
  constructor(private formBuilder: FormBuilder, private storeService: StoreService, private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.teamStoreId = Number(localStorage.getItem("teamStoreId"));
    this.setUpseoSettingsFormGroup();
    this.getSeoSettings();
  }

  setUpseoSettingsFormGroup() {
    this.seoSettingsGroup = this.formBuilder.group({
      pageType: new FormControl(''),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      focusKeyword: new FormControl('')
    });
  }

  saveTeamStoreChanges() {
    this.storeService.updateSeoSettings(this.seoSettingsGroup.value, this.teamStoreId).subscribe(
      (response) => {
        if (response.status == 1) {
          this.commonService.openSuccessSnackBar(response.message, '');
          this.onSuccessResponse(response.data);
          // const url = this.commonService.createUrl(this.router.url, '/developersettings', 2);
          // this.router.navigateByUrl(url);
        } else {
          this.commonService.openErrorSnackBar(response.message, '');
        }

      },
      (error) => {
        // alert(error);
        console.log(error);
      }
    );
  }


  getSeoSettings() {
    this.storeService.getStore(this.teamStoreId).subscribe(
      (response) => {
        this.onSuccessResponse(response.data);
      },
      (error) => {
        console.log(error);

      }
    );
  }

  onSuccessResponse(response: any) {
    this.seoSettingsObj = response.seoSettings;
    this.pageSelected = stringify(this.seoSettingsObj.pageType);
    this.seoSettingsGroup.setValue({
      pageType: stringify(this.seoSettingsObj.pageType),
      metaTitle: this.seoSettingsObj.metaTitle,
      metaDescription: this.seoSettingsObj.metaDescription,
      focusKeyword: this.seoSettingsObj.focusKeyword
    });
  }

}
