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
  storeCommissionType: number;
  defaultStoreClosedMessage = "This sale is no longer active, please contact your store administrator with any questions!"
  constructor(private commonService: CommonService, private formBuilder: FormBuilder, private storeService: StoreService, private router: Router) { }

  ngOnInit() {
    this.setUpStoreClosedPageFormGroup();
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));;
    this.getStoreClosedPage();
  }

  setUpStoreClosedPageFormGroup() {
    this.storeClosedPageGroup = this.formBuilder.group({
      title: new FormControl('', Validators.maxLength(50)),
      description: new FormControl(this.defaultStoreClosedMessage),
      displayGraphicImage: new FormControl(''),
      displayContactInfo: new FormControl('')
    });
  }

  saveTeamStoreChanges() {
    this.storeService.updateStoreClosedPage(this.storeClosedPageGroup.value, this.teamStoreId).subscribe(
      (response) => {
        if (response.status == 1) {
          this.commonService.openSuccessSnackBar(response.message, '');
          this.onSuccessResponse(response.data);
          const url = this.commonService.createUrl(this.router.url, '/designer', 2);
          this.router.navigateByUrl(url);
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


  getStoreClosedPage() {
    this.storeService.getStore(this.teamStoreId).subscribe(
      (response) => {
        this.onSuccessResponse(response.data);

      },
      (error) => {
        console.log(error);

      }
    );
  }

  onSuccessResponse(data: any) {
    this.storeClosedPageGroup.setValue({
      title: data.name,
      description: this.defaultStoreClosedMessage,
      displayGraphicImage: 0,
      displayContactInfo: 0
    });
  }

}
