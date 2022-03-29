import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoredetailsService } from '../../core/services/storedetails.service';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrls: ['./view-store.component.scss']
})
export class ViewStoreComponent implements OnInit {
  teamStoreId: any;
  layoutData: any;
  selectedComponent: any = 0;

  constructor(
    private storeDetailsService: StoredetailsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit () {
    this.teamStoreId = this.route.snapshot.params['storeId'];
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
