import { Component, OnInit } from '@angular/core';
import { StoredetailsService } from 'src/app/core/services/storedetails.service';

@Component({
  selector: 'app-store-layout',
  templateUrl: './store-layout.component.html',
  styleUrls: ['./store-layout.component.scss']
})
export class StoreLayoutComponent implements OnInit {

  teamStoreId: any;
  layoutData: any;
  selectedComponent: any = 0;

  constructor(
    private storeDetailsService: StoredetailsService
  ) { }

  ngOnInit () {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.getLayoutSettings();
  }

  getLayoutSettings () {
    this.storeDetailsService.getLayoutSettings(this.teamStoreId).subscribe((response) => {
      this.selectedComponent = response.data.layout.componentId;
      this.layoutData = JSON.parse(response.data.style);
      this.layoutData["closeDate"] = response.data.closeDate
      this.layoutData["disclaimer"] = response.data.disclaimer
    });
  }

}
