import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-checkout-settings',
  templateUrl: './checkout-settings.component.html',
  styleUrls: ['./checkout-settings.component.scss']
})
export class CheckoutSettingsComponent implements OnInit {
  checkoutSettingsGroup: FormGroup;
  customerPaymentSelected: any;
  poAttchmentSelected: any;
  purchaseOrderSelected: any;
  checkoutSettingObj: any;
  teamStoreId: number;

  constructor(private commonService: CommonService, private formBuilder: FormBuilder, private readonly storeService: StoreService, private router: Router) { }

  ngOnInit() {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));;
    this.setUpCheckoutSettingsFormGroup();
    this.getCheckoutSettings();
  }

  setUpCheckoutSettingsFormGroup() {
    this.checkoutSettingsGroup = this.formBuilder.group({
      customerPaymentType: new FormControl(''),
      acceptPurchaseOrderType: new FormControl(''),
      poAttachmentType: new FormControl(''),
      allowGiftToOrder: new FormControl(''),
      acceptCouponsOrGift: new FormControl(''),
      displayEstimatedDeliveryDate: new FormControl('')
    });
  }

  saveTeamStoreChanges() {
    this.storeService.updateCheckoutSettings(this.checkoutSettingsGroup.value, this.teamStoreId).subscribe(
      (response) => {
        if (response.status == 1) {
          this.commonService.openSuccessSnackBar(response.message, '');
          this.onSuccessResponse(response.data);
          const url = this.commonService.createUrl(this.router.url, '/customorderfields', 2);
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


  getCheckoutSettings() {
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
    this.checkoutSettingObj = response.checkoutSettings;
    this.checkoutSettingsGroup.setValue({
      customerPaymentType: stringify(this.checkoutSettingObj.customerPaymentType),
      acceptPurchaseOrderType: stringify(this.checkoutSettingObj.acceptPurchaseOrderType),
      poAttachmentType: stringify(this.checkoutSettingObj.poAttachmentType),
      allowGiftToOrder: this.checkoutSettingObj.allowGiftToOrder,
      acceptCouponsOrGift: this.checkoutSettingObj.acceptCouponsOrGift,
      displayEstimatedDeliveryDate: this.checkoutSettingObj.displayEstimatedDeliveryDate
    });
  }

}
