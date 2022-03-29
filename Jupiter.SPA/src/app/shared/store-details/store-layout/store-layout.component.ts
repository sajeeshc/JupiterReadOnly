import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoredetailsService } from 'src/app/core/services/storedetails.service';

let moment = require('moment')

@Component({
  selector: 'app-store-layout',
  templateUrl: './store-layout.component.html',
  styleUrls: ['./store-layout.component.scss']
})
export class StoreLayoutComponent implements OnInit {

  teamStoreId: any;
  layoutData: any;
  teamStoreName = 'store'
  selectedComponent: any = 0;
  loading = false
  isStoreClosed = false
  constructor(
    private storeDetailsService: StoredetailsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit () {
    this.teamStoreId = this.route.snapshot.params.storeId;
    if (this.teamStoreId == undefined)
      this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.getLayoutSettings();
  }

  getLayoutSettings () {
    this.loading = true
    this.storeDetailsService.getLayoutSettings(this.teamStoreId).subscribe((response) => {
      this.isStoreClosed = moment() > moment(response.data.closeDate, 'MM/DD/YYYY HH:mm:ss')
      this.selectedComponent = response.data.layout.componentId;
      this.layoutData = JSON.parse(response.data.style);
      this.layoutData["closeDate"] = response.data.closeDate
      this.layoutData["disclaimer"] = response.data.disclaimer
      this.teamStoreName = response.data.teamStoreName ? response.data.teamStoreName : "store"
      this.loading = false
    },(err)=>{
      this.loading = false
      this.layoutData = null
    });
  }

}
