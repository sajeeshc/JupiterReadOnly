import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-store-verification',
  templateUrl: './store-verification.component.html',
  styleUrls: ['./store-verification.component.scss']
})
export class StoreVerificationComponent implements OnInit {

  constructor(
    private storeService: StoreService,
    private commonService: CommonService,
  ) { }

  
  titleHtml
  contentHtml
  teamStoreId
  defaultTitleHtml = `<p><span style="color: rgb(33, 33, 33);">Good afternoon,</span></p><p><span style="color: rgb(33, 33, 33);">&nbsp;</span></p><p><span style="color: rgb(33, 33, 33);">Thank you for your patience as we created your custom online store.&nbsp;Please take a look and let us know if there are any last changes to the garments or designs you’d like us to make:</span></p>`
  defaultContentHtml = `<p><strong style="color: black;">*Please note: Shopping cart / checkout settings are deactivated until all products and art are finalized and approved.</strong><span style="color: black;">*</span></p><p><span style="color: black;">&nbsp;</span></p><p><strong style="color: black;"><em>THINGS TO REMEMBER:</em></strong></p><ul><li><strong><em>Changes cannot be made to your store (garments, pricing, designs, shipping option, fundraising amounts, etc.) Once there is a purchase on your store. PLEASE REVIEW YOUR STORE BEFORE SENDING OUT THE LINK to be sure you don’t wish to make further adjustments.</em></strong></li><li><strong><em>There is a 6pc per design minimum for screenprinted items to be produced.&nbsp;</em></strong><em>Items can combine purchases to meet this minimum if they share a design&nbsp;</em><strong><em>(same colors, same size, same placement on the garment)</em></strong></li><li><strong><em>Orders will ship approximately 15 business days AFTER</em></strong><em>&nbsp;</em><strong><em>the store's close date</em></strong><em>.</em>&nbsp;Please allow additional time for certain brands, such as Under Armour or Adidas. Items may go out in separate shipments. If an item becomes unavailable, the customer will be notified and the customer’s card will be refunded. Ares Sportswear reserves the right to cancel and fully refund orders that cannot be fulfilled.</li><li><strong><em>All items are custom made. Therefore, no returns or exchanges will be accepted on online store items.&nbsp;</em></strong>Orders will&nbsp;<strong>NOT</strong>&nbsp;be accepted after the store deadline.</li></ul><p><span style="color: rgb(50, 49, 48);">&nbsp;</span><em style="color: rgb(33, 33, 33);">&nbsp;</em></p><p><strong style="color: rgb(68, 114, 196);">If everything looks good and you’re ready for us to schedule your store to go live, please reply confirming the following:</strong></p>`
  ngOnInit() {    
    this.setData()
    this.teamStoreId = localStorage.getItem('teamStoreId')
    this.getEmailTemplateData()
  }
  

  setData(data?){
    if(data && data.title && data.staticContent){
      this.titleHtml = new FormControl(data.title)
      this.contentHtml = new FormControl(data.staticContent)
    }else{
      this.titleHtml = new FormControl(this.defaultTitleHtml)
      this.contentHtml = new FormControl(this.defaultContentHtml)
    }
  }

  getEmailTemplateData() {
    this.storeService.getEmailTemplateStoreVerification(this.teamStoreId).subscribe(res => {
      this.setData(res.data)
    })
  }

  updatePreview() {
    document.getElementById("preview-content").innerHTML = this.titleHtml.value + this.contentHtml.value
  }

  updateEmailTemplateData() {
    let data = {
      title: this.titleHtml.value,
      staticContent: this.contentHtml.value,
    }
    this.storeService.updateEmailTemplateStoreVerification(this.teamStoreId, data).subscribe(res => {
      this.commonService.openSuccessSnackBar("Email template saved successfully", "")
    }, err => {
      this.commonService.openErrorSnackBar("Some error occurred", "")
    })
  }

}
