import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  dashBoardDetailCount: any;
  user: any;
  teamStoreList: any;
  artList: any[] = [];

  constructor(private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private storeService: StoreService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getDashboardDetailsCount();
    this.getStoreRequestList();
    this.getArtList();
    this.commonService.setPageHeader('Artist & Store Builder Dashboard');
    this.commonService.backButtonToggle(false)
  }
  ngOnDestroy() {
    this.commonService.backButtonToggle(true)
  }
  getDashboardDetailsCount() {
    this.storeBuilderService.getDashboardDetailsCount(this.user.id).subscribe(
      (response) => {
        this.dashBoardDetailCount = response.data;
        console.log(this.dashBoardDetailCount);
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  getArtList() {
    this.storeService.getArtList({startDate:'', endDate:'', type:'1', artist:'', artType:'', serviceId:0}).subscribe(response => {
      if (response.data != null) {
        this.artList = response.data;
      }
      else {
      }
    });
  }

  getStoreRequestList() {
    this.storeBuilderService.getStoreRequestList({ orderBy: 'date', order: 'desc', type: '2,4,7,19', assignedTo: 0 }).subscribe(
      // this.storeBuilderService.getStoreRequestList(null, null, null, 'date', 'desc', '2,4,7',this.user.id).subscribe(
      (response) => {
        this.teamStoreList = response.body.data;
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  setHeader(header) {
    this.commonService.setPageHeader(header);
  }

  onCellClick(id: any) {
    localStorage.setItem("teamStoreId", id);
    this.setHeader('Store Requests');
    this.router.navigateByUrl('/storebuilder/storerequestlist');
  }

  onArtCellClick(id: any) {
    localStorage.setItem("teamStoreId", id);
    this.commonService.setPageHeader('Art Requests');
    this.router.navigateByUrl('/storebuilder/artqueuelist');
  }

}
