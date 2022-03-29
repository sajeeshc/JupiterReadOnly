import { Component, OnInit } from '@angular/core';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
import { StoreService } from 'src/app/core/services/store.service'
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-store-summary',
  templateUrl: './store-summary.component.html',
  styleUrls: ['./store-summary.component.scss']
})
export class StoreSummaryComponent implements OnInit {

  constructor(
    private storeBuilderService: StorebuilderService,
    private storeService: StoreService,
    private commonService: CommonService,
    private router: Router,
  ) { }

  storeId: number
  name: string = ""
  contactName: string = ""
  urlPattern = "^[A-Za-z0-9_-]+$";
  storeUrl = new FormControl("",[Validators.required, Validators.pattern(this.urlPattern)])
  createdBy: string = ""
  customerNotes: string = ""
  baseUrl = ""
  isUrlValid = true
  urlValidated = true
  stage
  hasLayoutDesign = false
  ngOnInit () {
    this.storeId = parseInt(localStorage.getItem("teamStoreId"));
    this.getSummary()
    this.baseUrl = environment.wpUrl + "store/?storeName="
  }

  getSummary () {
    this.storeBuilderService.getTeamStore(this.storeId).subscribe(response => {
      this.name = response.data.name;
      this.contactName = response.data.contactName;
      this.storeUrl.setValue(response.data.storeUrl);
      this.createdBy = response.data.createdBy.name;
      this.customerNotes = response.data.customerNotes;
      this.stage = response.data.stage
      this.hasLayoutDesign = response.data.hasLayoutDesign
      this.checkLayout()
      // if (response.data.storeUrl == '' || response.data.storeUrl == null) {
      //   let baseUrl = document.location.href;
      //   let splittedUrl = baseUrl.split("/");
      //   let url = splittedUrl[0] + '//' + splittedUrl[2] + '/store/' + response.data.id
      //   this.storeUrl = url;
      // }
    })
  }

  submit () {
    if(!this.checkLayout) return
    if(!this.urlValidated){
      this.validateStoreUrl(true)
      return
    }
    const model = {
      id: this.storeId,
      customerNotes: this.customerNotes,
      storeUrl: this.storeUrl.value,
      stage: this.stage == 19 ? 9 : 6,
    }
    this.storeService.updateStore(model).subscribe(
      response => {
        this.commonService.openSuccessSnackBar(response.message, '');
        this.router.navigateByUrl("/storebuilder/storerequestlist");
        let data = { replaceHome: true };
        window.parent.postMessage(data, "*");
      },
      error => {
        this.commonService.openErrorSnackBar(error.message, '');
      }
    )
  }

  checkLayout(){
    if(!this.hasLayoutDesign){
      Swal.fire({
        title:"Layout not designed!",
        text:"You have not designed a layout for this store. Please design a layout to submit store build",
        icon:"warning",
      })
      return false
    }else{
      return true
    }
  }

  validateStoreUrl(submit?){
    if(!this.storeUrl.valid){
      // this.commonService.openErrorSnackBar("Invalid characters found in URL","")
      this.commonService.openWarningSnackBar("URL should contain only alphabets, numbers, underscore (_) and hyphen (-)","")
      return
    }
    this.storeService.validateStoreUrl(this.storeUrl.value,this.storeId).subscribe(res=>{
      if(res.data.isValid){
        this.commonService.openSuccessSnackBar("URL is valid", "")
        this.urlValidated = true
      }else{
        this.commonService.openErrorSnackBar("URL is not valid","")
      }
      if(submit) this.submit()
    })
  }

  onUrlChange(){
    this.urlValidated = false
  }
}
