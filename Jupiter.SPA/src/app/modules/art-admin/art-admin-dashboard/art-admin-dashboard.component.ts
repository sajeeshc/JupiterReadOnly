import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

@Component({
  selector: 'app-art-admin-dashboard',
  templateUrl: './art-admin-dashboard.component.html',
  styleUrls: ['./art-admin-dashboard.component.scss']
})
export class ArtAdminDashboardComponent implements OnInit {

  constructor(private commonService: CommonService,
    private storeBuilderService: StorebuilderService) { }

  dashBoardDetailCount: any;

  ngOnInit () {
    this.commonService.setPageHeader('Art Admin Dashboard');
    this.getDashboardDetailsCount();
  }

  getDashboardDetailsCount () {
    this.storeBuilderService.getDashboardDetailsCount(0).subscribe(
      (response) => {
        this.dashBoardDetailCount = response.data;
      },
      (error) => {
      }
    );
  }

  setHeader (header) {
    this.commonService.setPageHeader(header);
  }

}
