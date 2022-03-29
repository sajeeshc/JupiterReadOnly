import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-coupons-discounts',
  templateUrl: './coupons-discounts.component.html',
  styleUrls: ['./coupons-discounts.component.scss']
})
export class CouponsDiscountsComponent implements OnInit {

  isCouponListHidden: boolean;
  isCouponCreateHidden: boolean;
  panelOpenState : boolean;

  generalGroup: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.changeCouponVisibility(true);
    this.panelOpenState= false;

    this.generalGroup= this.formBuilder.group({
      effectiveDate: new FormControl(''),
      expirationDate: new FormControl('')
    });
  }

  changeCouponVisibility(value: boolean){
    this.isCouponCreateHidden= value;
    this.isCouponListHidden= !value;
  }
}
