import { Component, OnInit } from '@angular/core';
import { StoredetailsService } from 'src/app/core/services/storedetails.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';

let moment = require('moment')

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  teamStoreId: any;
  layoutData: any;
  teamStoreName = 'store'
  isStoreClosed = false
  selectedComponent: any;
  teamStoreData
  private wpUrl = `${environment.wpUrl}`;
  loading = false
  constructor(
    private storeDetailsService: StoredetailsService,
    private route : ActivatedRoute,
    private storeBuilderService: StorebuilderService,
    private commonService: CommonService,
    private router: Router,
    ) { }

  ngOnInit () {
    // this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.teamStoreId = this.route.snapshot.paramMap.get('teamstoreId')
    // localStorage.setItem('teamStoreId',this.teamStoreId);
    this.getLayoutSettings();
    this.getTeamStore()
  }

  getTeamStore () {
    this.storeBuilderService.getTeamStore(this.teamStoreId).subscribe(response => {
      this.teamStoreData = response.data;
      localStorage.setItem('teamStoreId',response.data.id);
      this.teamStoreId = response.data.id
      if(!this.layoutData.closeDate){
        this.layoutData['closeDate'] = this.teamStoreData.closeDate
      }
      if(!this.layoutData.header.logoUrl)
        this.layoutData.header.logoUrl = this.teamStoreData.logo
    },
      error => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
  }

  eventHandler (eventType) {
    // console.log(eventType);
    switch (eventType.type) {
      case 'home':
        window.location.href = this.wpUrl;
        break;
      case 'productList':
        window.location.href = this.wpUrl + 'product-list';
        break;
      case 'productSelected':
        localStorage.setItem('teamStoreId', this.teamStoreId);
        localStorage.setItem('productId', eventType.value);
        localStorage.setItem('purchaseType', '3');
        let productId = eventType.colorId ? (eventType.value + "-" + eventType.colorId) : eventType.value
        this.router.navigateByUrl('/enduser/buyfromlivestore/productview/' + productId + '/' + eventType.mapCode);
      default:
        break;
    }
  }

  getLayoutSettings () {
    this.loading = true
    this.storeDetailsService.getLayoutSettings(this.teamStoreId).subscribe((response) => {
      this.isStoreClosed = moment() > moment(response.data.closeDate, 'MM/DD/YYYY HH:mm:ss')
      this.selectedComponent = response.data.layout.componentId;
      this.layoutData = JSON.parse(response.data.style);
      this.layoutData["closeDate"] = response.data.closeDate
      this.teamStoreName = response.data.teamStoreName ? response.data.teamStoreName : "store"
      this.layoutData["disclaimer"] = response.data.disclaimer
      this.loading = false
    }, (err)=>{
      this.loading = false
    });
  }

}
