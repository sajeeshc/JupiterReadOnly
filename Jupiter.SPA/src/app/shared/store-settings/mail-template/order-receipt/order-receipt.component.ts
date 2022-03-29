import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-order-receipt',
  templateUrl: './order-receipt.component.html',
  styleUrls: ['./order-receipt.component.scss']
})
export class OrderReceiptComponent implements OnInit {

  constructor(
    private storeService: StoreService,
    private commonService: CommonService,
  ) { }

  templateHtml
  logoUrl
  noImage = "../../../assets/images/no-image.png"
  defaultTemplate = `<h1 class="ql-align-center"><span style="color: black;">We've received your order</span></h1><p class="ql-align-center"><br></p><p class="ql-align-center"><span style="color: black;">Thank you for shopping at Ares Sportswear: {{{Store Name Here}}}. The summary of your recent order is listed below. If you would like to see more details of the order status click the button below.</span></p><p class="ql-align-center">&nbsp;</p><p class="ql-align-center"><strong style="color: black;"><em>ARES Sportswear makes every effort possible to ship all items ordered in a timely manner.&nbsp;We cannot ship any teamstore items until the last item in a store arrives in our printing facility.&nbsp;If any of your items are backordered at the time we close this store we must cancel them and issue an immediate refund so that we do not hold up production for the whole store.&nbsp;This policy is in place to assure we can print and ship the rest of the team’s items out in a timely basis.&nbsp;Thank you.</em></strong></p><p class="ql-align-center"><br></p><p class="ql-align-center"><span style="color: black;">ORDERS CAN NOT BE CANCELED OR REFUNDED FOR ANY REASON, INCLUDING BUT NOT LIMITED TO, COVID-19 RELATED SHUTDOWNS OR CANCELLATION OF SPORTS SEASON.&nbsp;ITEMS ARE CUSTOM-MADE WHEN ORDER IS PLACED.</span></p>`
  teamStoreId
  ngOnInit() {
    this.setData(null,null,null)
    this.teamStoreId = localStorage.getItem('teamStoreId')
    this.getEmailTemplateData()
  }

  getEmailTemplateData() {
    this.storeService.getEmailTemplateOrderReceipt(this.teamStoreId).subscribe(res => {
      this.setData(res.data.staticContent, res.data.storeLogo, res.data.storeName)
    })
  }

  updateEmailTemplateData() {
    let data = {
      storeLogo: this.logoUrl,
      staticContent: this.templateHtml.value,
    }
    this.storeService.updateEmailTemplateOrderReceipt(this.teamStoreId, data).subscribe(res => {
      this.commonService.openSuccessSnackBar("Email template saved successfully", "")
    }, err => {
      this.commonService.openErrorSnackBar("Some error occurred", "")
    })
  }

  setData(templateHtml, logoUrl, storeName) {
    if(storeName)
      this.defaultTemplate = this.defaultTemplate.replace('{{{Store Name Here}}}',storeName)
    this.templateHtml = new FormControl(templateHtml || this.defaultTemplate)
    this.logoUrl = logoUrl || ''
  }

  uploadLogo(files) {
    const formData = new FormData();
    formData.append("file", files.item(0));
    if (files.item(0).name.split(".").pop() == "pdf") {
      this.storeService.uploadPdfArt(formData).subscribe(
        (response) => {
          this.logoUrl = response.data.imageFileUrls[0]
        },
      );
    } else {
      this.storeService.uploadArt(formData).subscribe(
        (response) => {
          this.logoUrl = response.data
        },
      );
    }
  }

  updatePreview() {
    document.getElementById("preview-content").innerHTML = this.templateHtml.value
  }

}
