import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  ) { }

  storeId: number
  productId: number
  user: any;
  srcString: string = "http://imprint.eastus2.cloudapp.azure.com/designer/index.php?";
  //srcString: string = "http://imprint.eastus2.cloudapp.azure.com/imprintNextDesigner/index.html?"

  ngOnInit () {
    this.storeId = parseInt(localStorage.getItem("teamStoreId"));
    this.user = JSON.parse(localStorage.getItem("user"));
    this.productId = parseInt(this.route.snapshot.paramMap.get('productId'));
    this.setSrc()
  }

  setSrc () {
    this.srcString += 'id=' + this.productId
    this.srcString += "&vid=45&qty=1&pbti=0"
    this.srcString += "&store_id=" + this.storeId + '.' + this.user.id
    //this.srcString += "&teamstoreId=" + this.storeId
    this.srcString += "&userId=" + this.user.id
    
    let iframe = <HTMLIFrameElement>document.getElementById('designeriframe')
    iframe.src = this.srcString
  }
}
