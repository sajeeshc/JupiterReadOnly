import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreManagerService } from 'src/app/core/services/store-manager.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {

  storeReqList: any = [];
  columnsToDisplay = ['name', 'createdDate'];
  expandedElement: any = null;
  dashBoardDetailCount: any;
  newReqList: any = [];

  constructor(private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private storeManagerService: StoreManagerService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.getStoreRequestList();
    this.getDashboardDetailsCount();
    this.getNewCustomerReqList();
    this.commonService.setPageHeader('Finance Manager Dashboard');
    this.commonService.backButtonToggle(false)
  }

  ngOnDestroy() {
    this.commonService.backButtonToggle(true)
  }
  getStoreRequestList() {
    this.storeBuilderService.getStoreRequestList({ orderBy: 'date', order: 'desc', type: 9 }).subscribe(
      // this.storeBuilderService.getStoreRequestList(null, null, null, 'date', 'desc', 9).subscribe(
      (response) => {
        this.storeReqList = response.body.data;
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }


  getDashboardDetailsCount() {
    this.storeManagerService.getDashboardDetailsCount().subscribe(
      (response) => {
        this.dashBoardDetailCount = response.body.data;
        console.log(this.dashBoardDetailCount);
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  getNewCustomerReqList() {
    this.storeBuilderService.getStoreRequestList({ orderBy: 'date', order: 'desc', type: '1' }).subscribe(
      // this.storeBuilderService.getStoreRequestList(null, null, null, 'date', 'desc', '1').subscribe(
      (response) => {
        this.newReqList = response.body.data;
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  setHeader(header) {
    this.commonService.setPageHeader(header);
  }

  redirectToRequestPage(id: any, header) {
    localStorage.setItem("teamStoreId", id);
    this.commonService.setPageHeader(header);
    this.router.navigateByUrl('/storemanager/storerequest/' + id + '/2');
  }

}
