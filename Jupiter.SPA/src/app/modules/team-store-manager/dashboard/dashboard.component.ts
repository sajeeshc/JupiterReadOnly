import { trigger, state, style, transition, animate } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreManagerService } from 'src/app/core/services/store-manager.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
const moment = require('moment')
declare var $ : any;

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
  dashBoardDetailCount:any;
  newReqList:any=[];
  storeForm:FormGroup;

  constructor(private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private storeManagerService : StoreManagerService,
    private commonService : CommonService,
    private formBuilder : FormBuilder,
    private storeService :  StoreService) { }

  ngOnInit() {
    this.createStoreForm();
    this.getStoreRequestList();
    this.getDashboardDetailsCount();
    this.createStoreForm()
    this.getNewCustomerReqList();
    this.commonService.setPageHeader('Account Manager Dashboard');
    this.commonService.backButtonToggle(false)
  }
  createStoreForm() {
    this.storeForm = this.formBuilder.group({
      id: 0,
      closeDate: '04/30/2021',
      minDate: new Date()
    });
  }
  ngOnDestroy() {
    this.commonService.backButtonToggle(true)
  }
  getStoreRequestList() {
    this.storeBuilderService.getStoreRequestList({ orederBy: 'date', order: 'desc', type: 9 }).subscribe(
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
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  getNewCustomerReqList() {
    this.storeBuilderService.getStoreRequestList({ orderBy: 'date', order: 'desc', type: '2' }).subscribe(
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

  resetBulkOrderEntry() {
    localStorage.removeItem("bulkOrderEntry")
    localStorage.removeItem("bulkOrderEntryUserId")
    localStorage.removeItem("bulkOrderEntryDesignIndex")
  }

  updateStoreClosure() {
    let datePipe = new DatePipe('en-US');
    console.log(this.storeForm.value)
    this.storeForm.value.closeDate = moment(this.storeForm.get('closeDate').value).format("MM/DD/YYYY HH:mm:ss")
    this.storeService.updateStore(this.storeForm.value).subscribe(
      (response) => {
        if (response.status == 1) {
          this.commonService.openSuccessSnackBar('Store closure date updated successfully', '');
          this.getStoreRequestList();
        } else {
          this.commonService.openErrorSnackBar('Failed to update store closure', '');
        }
        $('#storeClosureModal').modal('hide');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  invalidClosingDay() {
    // return true if day is friday or saturday
    let date = this.storeForm.controls.closeDate.value
    if (moment(date).day() >= 5) {
      this.storeForm.controls.closeDate.setErrors({ invalidDay: "true" })
      this.commonService.openWarningSnackBar("Close Date cannot be Friday or Saturday", "");
      return true
    } else {
      return false
    }
  }

  openStoreClosureModal(storeDetail) {

    this.storeForm = this.formBuilder.group({
      id: storeDetail.id,
      closeDate: this.setDateToDatepicker(storeDetail.closeDate),
      minDate: moment(storeDetail.openDate).add(2, 'weeks').startOf('day').toDate()
    });
    $('#storeClosureModal').modal('show');
  }

  setDateToDatepicker(date: any) {
    return moment(date, "MM/DD/YYYY HH:mm:ss").toDate()
  }
}
