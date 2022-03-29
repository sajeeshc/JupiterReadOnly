import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { timeStamp } from 'console';
import { DomainService } from 'src/app/core/services/domain.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-store-domain',
  templateUrl: './store-domain.component.html',
  styleUrls: ['./store-domain.component.scss']
})
export class StoreDomainComponent implements OnInit {
  customDomainGroup: FormGroup;
  customDomainObj: any;
  customDomainType: number;
  isCustomDomainBoxVisible: boolean;
  teamStoreId: number;
  isDomainValid: boolean;
  isDomainValidated: boolean;
  constructor(private formBuilder: FormBuilder, private storeService: StoreService, private domainService: DomainService,
    private router: Router) { }

  ngOnInit() {
    this.teamStoreId=parseInt(localStorage.getItem("teamStoreId"));
    this.setUpCustomDomainFormGroup();
    this.getDomainSettings();
  }

  setUpCustomDomainFormGroup(){
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.customDomainGroup= this.formBuilder.group({
      domainUrl: new FormControl('', [Validators.pattern(reg)])
    });
  }

  changeCustomDomainBoxHidden(value: boolean){
    this.isCustomDomainBoxVisible=value;
      this.customDomainGroup.setValue({
        domainUrl : this.customDomainObj.domainUrl,
      });
  }

  saveTeamStoreChanges(){
    this.customDomainGroup.value.domainType= this.isCustomDomainBoxVisible?0:1;
    this.customDomainGroup.value.domainUrl=this.customDomainGroup.value.domainType===undefined||
                                              stringify(this.customDomainGroup.value.domainType)==="0"?"":this.customDomainGroup.value.domainUrl;
    this.storeService.updateDomainSettings(this.customDomainGroup.value, this.teamStoreId).subscribe(
      (response) => {
        this.onSuccessResponse(response.data);
        this.router.navigateByUrl("/storebuilder/storedetails/storesettings/seosettings");
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getDomainSettings(){
    this.storeService.getStore(this.teamStoreId).subscribe(
      (response) => {
        this.onSuccessResponse(response.data);
      },
      (error) => {
        console.log(error);

      }
    );
  }

  onSuccessResponse(response: any){
    this.customDomainObj= response.customDomains;
        this.customDomainType=this.customDomainObj.domainType;
        this.isCustomDomainBoxVisible= this.customDomainType==0?true:false;
        this.customDomainGroup.setValue({
          domainUrl : this.customDomainObj.domainUrl,
        });
        this.changeCustomDomainBoxHidden(this.isCustomDomainBoxVisible);
  }

  validateDomain(){
    var url=stringify(this.customDomainGroup.value.domainUrl);
    url= (url.indexOf("https://") >0 || url.indexOf("https://")>0) ? url: "http://"+url;
    this.domainService.validate(url).subscribe(
      (response) => {
        this.isDomainValidated=true;
      },
      (error) => {
        this.isDomainValidated=false;
      }
    );
  }

}
