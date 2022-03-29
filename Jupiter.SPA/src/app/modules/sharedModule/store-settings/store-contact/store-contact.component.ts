import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
import { StoredetailsService } from 'src/app/core/services/storedetails.service';

@Component({
  selector: 'app-store-contact',
  templateUrl: './store-contact.component.html',
  styleUrls: ['./store-contact.component.scss']
})
export class StoreContactComponent implements OnInit {

  contactInfoGroup: FormGroup;
  teamStoreId:number;
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public phonePattern = "[- +()0-9]+";

  constructor(private formBuilder: FormBuilder,
    private router : Router,
    private storedetailsService : StoredetailsService,
    private storeBuilderService: StorebuilderService,
    private commonService : CommonService) { }

  ngOnInit() {
    this.teamStoreId=parseInt(localStorage.getItem("teamStoreId"));
    this.setUpContactInfoFormGroup();
    this.getTeamStore(this.teamStoreId);
  }

  setUpContactInfoFormGroup(){
    this.contactInfoGroup= this.formBuilder.group({
      company: new FormControl('',Validators.required),
      firstName: new FormControl('',Validators.required),
      lastName: new FormControl('',Validators.required),
      email: new FormControl('',[Validators.required,Validators.pattern(this.emailPattern)]),
      phone: new FormControl('',[Validators.required,Validators.pattern(this.phonePattern), Validators.minLength(10), Validators.maxLength(10)]),
      fax: new FormControl('',Validators.required),
      address: new FormControl('',Validators.required),
      appartment: new FormControl('',Validators.required),
      country: new FormControl('',Validators.required),
      city: new FormControl('',Validators.required),
      state: new FormControl('',Validators.required),
      zip: new FormControl('',Validators.required),
      showGoogleMapOnContactUs:new FormControl(false)
    });
  }

  getTeamStore(teamStoreId) {
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe((response) => {
      var teamStore = response.data;
      this.contactInfoGroup.setValue({
      company :teamStore.contact.company,
      firstName:teamStore.contact.firstName,
      lastName:teamStore.contact.lastName,
      email: teamStore.contact.email,
      phone: teamStore.contact.phone,
      fax: teamStore.contact.fax,
      address: teamStore.contact.address,
      appartment: teamStore.contact.appartment,
      country:teamStore.contact.country,
      city: teamStore.contact.city,
      state: teamStore.contact.state,
      zip:teamStore.contact.zip,
      showGoogleMapOnContactUs:teamStore.contact.showGoogleMapOnContactUs,
      });
    });
  }

  updateContactInfo(){

 if(this.contactInfoGroup.valid){
  this.storedetailsService.updateStoreContactInfo(this.contactInfoGroup.value,this.teamStoreId).subscribe(
(response) => {
  if(response.status==1){
    this.commonService.openSuccessSnackBar(response.message,'');
  this.router.navigateByUrl("/storebuilder/storedetails/storesettings/storebranding");

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
}


