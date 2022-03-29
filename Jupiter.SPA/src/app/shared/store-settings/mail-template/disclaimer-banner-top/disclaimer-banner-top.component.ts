import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/core/services/store.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-disclaimer-banner-top',
  templateUrl: './disclaimer-banner-top.component.html',
  styleUrls: ['./disclaimer-banner-top.component.scss']
})
export class DisclaimerBannerTopComponent implements OnInit {

  constructor(
    private storeService: StoreService,
    private commonService: CommonService,
  ) { }

  teamStoreId
  disclaimer = `ORDERS CAN NOT BE CANCELED OR REFUNDED FOR ANY REASON, INCLUDING BUT NOT LIMITED TO, COVID-19 RELATED SHUTDOWNS OR CANCELLATION OF SPORTS SEASON. ITEMS ARE CUSTOM-MADE WHEN ORDER IS PLACED`
  ngOnInit() {
    this.teamStoreId = localStorage.getItem('teamStoreId')
    this.getDisclaimer()
  }

  getDisclaimer(){
    this.storeService.getDisclaimerTemplate(this.teamStoreId).subscribe(res => {
      if(res.data)
        this.disclaimer = res.data.disclaimer
    })
  }

  saveDisclaimer(){
    let data = {
      teamStoreId:this.teamStoreId,
      disclaimer:this.disclaimer,
  }
    this.storeService.updateDisclaimerTemplate(data).subscribe(res => {
      this.commonService.openSuccessSnackBar("Disclaimer template saved","")
    })
  }
}
