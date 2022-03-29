import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-store-policies',
  templateUrl: './store-policies.component.html',
  styleUrls: ['./store-policies.component.scss']
})
export class StorePoliciesComponent implements OnInit {
  storePoliciesGroup: FormGroup;
  teamStoreId: number;
  storePoliciesObj: any[]=[];
  thankYouMessageSelected: string;
  PackingSlipFooterSelected: string;
  privacyPolicySelected: string;
  termsOfUseSelected: string;
  thankYouMessage: any;
      PackingSlipFooter: any;
      privacyPolicy: any;
      termsOfUse: any;
  constructor(private formBuilder: FormBuilder, private storeService: StoreService, private router: Router,
    private commonService : CommonService) { }

  ngOnInit() {
    this.teamStoreId=parseInt(localStorage.getItem("teamStoreId"));
    this.setUpStorePoliciesFormGroup();
    this.getStorePolicies();
  }

  setUpStorePoliciesFormGroup(){
    this.storePoliciesGroup= this.formBuilder.group({
      thankYouMessage: new FormControl('',Validators.required),
      PackingSlipFooter: new FormControl('',Validators.required),
      privacyPolicy: new FormControl('',Validators.required),
      termsOfUse: new FormControl('',Validators.required)
    });
  }

  saveTeamStoreChanges(){
    if(this.storePoliciesGroup.valid){
      let policyListObj: any[]=[];
      policyListObj.push({
          "storePolicyType":"0", "storePolicyTextType":this.storePoliciesGroup.value.thankYouMessage},{
            "storePolicyType":"1", "storePolicyTextType":this.storePoliciesGroup.value.PackingSlipFooter},{
              "storePolicyType":"2", "storePolicyTextType":this.storePoliciesGroup.value.privacyPolicy},{
                "storePolicyType":"3", "storePolicyTextType":this.storePoliciesGroup.value.termsOfUse});
           console.log(policyListObj);
      this.storeService.updateStorePolicies(policyListObj, this.teamStoreId).subscribe(
        (response) => {
          if(response.status==1){
            this.commonService.openSuccessSnackBar(response.message,'');
            this.onSuccessResponse(response.data);
          this.router.navigateByUrl("/storebuilder/storedetails/storesettings/privacysettings");
          }
          else{
           this.commonService.openErrorSnackBar(response.message,'');
          }
          
        },
        (error) => {
          console.log(error);
        }
      );
    }
    
  }
  

  getStorePolicies(){
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
    this.storePoliciesObj= response.policies;
    this.storePoliciesObj.forEach(item => {
      if(item.storePolicyType===0){
        this.thankYouMessage= item;
        console.log(item);
      }
      else if(item.storePolicyType===1){
        this.PackingSlipFooter= item;
      }
      else if(item.storePolicyType===2){
        this.privacyPolicy= item;
      }
      else if(item.storePolicyType===3){
        this.termsOfUse= item;
      }
    });
    this.storePoliciesGroup.setValue({
      thankYouMessage:stringify(this.thankYouMessage.storePolicyTextType),
      PackingSlipFooter:stringify(this.PackingSlipFooter.storePolicyTextType),
      privacyPolicy:stringify(this.privacyPolicy.storePolicyTextType),
      termsOfUse:stringify(this.termsOfUse.storePolicyTextType),
    });
  }

}
