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
  teamStoreId: number;
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public phonePattern = "[- +()0-9]+";
  stateArray = []
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private storedetailsService: StoredetailsService,
    private storeBuilderService: StorebuilderService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.setUpContactInfoFormGroup();
    this.getTeamStore(this.teamStoreId);
    this.getAllStates();
  }

  setUpContactInfoFormGroup() {
    this.contactInfoGroup = this.formBuilder.group({
      company: new FormControl('', Validators.required),
      contactName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(this.phonePattern), Validators.minLength(10), Validators.maxLength(10)]),
      fax: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      appartment: new FormControl('', Validators.required),
      country: new FormControl('US'),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),
      showGoogleMapOnContactUs: new FormControl(false)
    });
  }

  getTeamStore(teamStoreId) {
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe((response) => {
      let teamStore = response.data;
      this.contactInfoGroup.setValue({
        company: teamStore.organizationName || '',
        contactName: teamStore.contactName || "",
        email: teamStore.emailId || "",
        phone: teamStore.phoneNumber || "",
        fax: teamStore.fax || "",
        address: teamStore.organizationAddress || "",
        appartment: teamStore.appartment || "",
        country: teamStore.country || "",
        city: teamStore.city || "",
        state: Number(teamStore.state) || "",
        zip: teamStore.zip || "",
        showGoogleMapOnContactUs: teamStore.showGoogleMapOnContactUs || "",
      });
    });
  }

  updateContactInfo() {

    if (this.contactInfoGroup.valid) {
      this.storedetailsService.updateStoreContactInfo(this.contactInfoGroup.value, this.teamStoreId).subscribe(
        (response) => {
          if (response.status == 1) {
            this.commonService.openSuccessSnackBar(response.message, '');
            const url = this.commonService.createUrl(this.router.url, '/storebranding', 2);
            this.router.navigateByUrl(url);

          }
          else {
            this.commonService.openErrorSnackBar(response.message, '');
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  getAllStates() {
    this.commonService.getAllStates().subscribe(response => {
      if (response.data != null) {
        this.stateArray = response.data;
      }
    })
  }
}


