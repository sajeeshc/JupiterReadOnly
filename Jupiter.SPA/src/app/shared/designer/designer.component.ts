import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  ) { }

  showFloatingData = false
  showFloatingIcon = false

  storeId: number
  productId
  user: any;
  isImage: any = 1;
  isUser: any = 0;
  designData 
  private srcString = `${environment.designerUrl}`;
  productIndex
  ngOnInit () {
    this.designData = JSON.parse(localStorage.getItem('designData'))
    localStorage.removeItem('designData')
    if(this.designData)
      this.showFloatingIcon = true
    this.storeId = parseInt(localStorage.getItem("teamStoreId")) | 0;
    this.user = JSON.parse(localStorage.getItem("user"));
    this.productId = this.route.snapshot.paramMap.get('productId')
    this.productIndex = localStorage.getItem('builderDesignedProductIndex')
    this.productIndex = this.productIndex ? Number(this.productIndex) + 1 : 0
    // this.productId = parseInt(this.route.snapshot.paramMap.get('productId'));
    if (this.storeId == 0) {
      this.isUser = 1;
      this.isImage = 0;
    }
    this.setSrc()
  }

  setSrc () {
    let userId = this.user ? this.user.id : 0
    let iframe = <HTMLIFrameElement>document.getElementById('designeriframe')
    iframe.src = this.srcString + "index.html?id=" + this.productId 
    + "&vid=45&qty=" + (this.productIndex || 0)
    + "&pbti=0&store_id=1&teamstoreId=" + this.storeId 
    + "&userId=" + userId + "&customer=" + userId
    + "&isImage=" + this.isImage + "&isUser=" + this.isUser 
  }

  // stage
  // iframe.src = this.srcString + "designer/index.html?id=" + this.productId + "&vid=45&qty=1&pbti=0&store_id=1&teamstoreId=" + this.storeId + "&userId=" + this.user.id + "&isImage=" + this.isImage + "&isUser=" + this.isUser;

  // dev
  // iframe.src = this.srcString + "designer/index.html?id=" + this.productId + "&vid=45&qty=1&pbti=0&store_id=" + this.storeId + "." + this.user.id + "&customer_id=2";
  toggleFloatingData(){
    this.showFloatingData = !this.showFloatingData
  }
}
