import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-store-closed-page',
  templateUrl: './store-closed-page.component.html',
  styleUrls: ['./store-closed-page.component.scss']
})
export class StoreClosedPageComponent implements OnInit {
  storeClosedPageGroup: FormGroup;
  teamStoreId: number;
  storeclosedPageObj: any={};
  storeCommissionType: number;
  constructor(private commonService : CommonService, private formBuilder: FormBuilder,private storeService: StoreService, private router: Router) { }

  ngOnInit() {
    this.setUpStoreClosedPageFormGroup();
    this.teamStoreId= parseInt(localStorage.getItem("teamStoreId"));;
    this.getStoreClosedPage();
  }

  setUpStoreClosedPageFormGroup(){
    this.storeClosedPageGroup= this.formBuilder.group({
      title: new FormControl('',Validators.maxLength(50)),
      description: new FormControl(''),
      displayGraphicImage: new FormControl(''),
      displayContactInfo: new FormControl('')
    });
  }

  saveTeamStoreChanges(){
    this.storeService.updateStoreClosedPage(this.storeClosedPageGroup.value, this.teamStoreId).subscribe(
      (response) => {
        if(response.status == 1){
          this.commonService.openSuccessSnackBar(response.message,'');
          this.onSuccessResponse(response.data);
        this.router.navigateByUrl("/storebuilder/storedetails/storesettings/designer");
      
        }else{
          this.commonService.openErrorSnackBar(response.message,'');
        }
        
      },
      (error) => {
        // alert(error);
        console.log(error);
      }
    );
  }
 

  getStoreClosedPage(){
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
    this.storeclosedPageObj= response.storeClosedPage;
        this.storeClosedPageGroup.setValue({
          title : this.storeclosedPageObj.title,
          description: this.storeclosedPageObj.description,
          displayGraphicImage: this.storeclosedPageObj.displayGraphicImage,
          displayContactInfo:  this.storeclosedPageObj.displayContactInfo
        });
  }

}
