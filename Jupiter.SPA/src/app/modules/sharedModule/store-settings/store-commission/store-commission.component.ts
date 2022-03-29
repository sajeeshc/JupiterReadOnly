import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-store-commission',
  templateUrl: './store-commission.component.html',
  styleUrls: ['./store-commission.component.scss']
})
export class StoreCommissionComponent implements OnInit {
  isStoreCommissionBoxVisible: boolean;
  storeCommissionGroup: FormGroup;
  teamStoreId: number;
  storeCommission: any={};
  storeCommissionType: number;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private storeService: StoreService,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.setUpStoreCommissionFormGroup();
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));;
    this.getStoreCommission();
  }

  setUpStoreCommissionFormGroup(){
    this.storeCommissionGroup= this.formBuilder.group({
      percentageOfTotalSales: new FormControl('')
    });
  }

  changeStoreCommissionOnBoxHidden(value: boolean){
    this.isStoreCommissionBoxVisible=value;
  }

  saveTeamStoreChanges(){
    this.storeCommission.storeCommissionType= this.isStoreCommissionBoxVisible?1:2;
    this.storeCommission.commissionPercentage= this.storeCommissionGroup.value.percentageOfTotalSales;
    if(this.storeCommission.storeCommissionType===1){
      this.storeCommission.commissionPercentage=0;
    }
    this.storeService.updateStoreCommission(this.storeCommission, this.teamStoreId).subscribe(
      (response) => {
        if(response.status == 1){
          this.commonService.openSuccessSnackBar(response.message,'');
          this.onSuccessResponse(response.data);
        this.router.navigateByUrl("/storebuilder/storedetails/storesettings/storedomain");
      
        }else{
          this.commonService.openErrorSnackBar(response.message,'');
        }
        
      },
      (error) => {
        console.log(error);
      }
    );
  }
  

  getStoreCommission(){
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
    this.storeCommission= response.storeCommission;
        this.storeCommissionType=this.storeCommission.storeCommissionType;
        this.isStoreCommissionBoxVisible= this.storeCommissionType==1?true:false;
        this.storeCommissionGroup.setValue({
          percentageOfTotalSales : this.storeCommission.commissionPercentage,
        });
  }

}
