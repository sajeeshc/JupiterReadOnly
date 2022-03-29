import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreManagerService } from 'src/app/core/services/store-manager.service';

@Component({
  selector: 'app-product-dashoard',
  templateUrl: './product-dashoard.component.html',
  styleUrls: ['./product-dashoard.component.scss']
})
export class ProductDashoardComponent implements OnInit, OnDestroy {

  constructor(private commonService : CommonService, private storeManagerService : StoreManagerService,) { }

  dashBoardDetailCount:any;

  ngOnInit() {
    this.setHeader("Product/Purchase Manager Dashboard")
    this.commonService.backButtonToggle(false)
  }

  ngOnDestroy(){
    this.commonService.backButtonToggle(true)
  }

  setHeader (header) {
    this.commonService.setPageHeader(header);
    this.getDashboardDetailsCount()
  }

  getDashboardDetailsCount () {
    this.storeManagerService.getDashboardDetailsCount().subscribe(
      (response) => {
        this.dashBoardDetailCount = response.body.data;
      },
      (error) => {
      }
    );
  }
}
