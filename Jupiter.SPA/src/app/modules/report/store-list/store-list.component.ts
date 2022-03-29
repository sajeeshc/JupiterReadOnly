import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss']
})
export class StoreListComponent implements OnInit {

  constructor(
    private storeBuilderService: StorebuilderService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
  ) { }

  reportName
  dataSource = []
  ownerId
  roles
  loading = false
  columnsToDisplay = [
    "storeId",
    "name",
    "status",
    "closeDate",
  ];

  ngOnInit() {
    this.ownerId = localStorage.getItem('userId')
    this.roles = JSON.parse(localStorage.getItem('user')).roles
    this.reportName = this.route.snapshot.paramMap.get('reportName')
    this.commonService.setPageHeader('Store List')
    this.getStoreRequestList()
  }


  getStoreRequestList() {
    // let name = this.filterFormGroup.get("name").value;
    // let stage = this.filterFormGroup.get("stage").value; //'6,9,10,11'
    // let mgrId = this.filterFormGroup.get("manager").value;
    // this.filterParams.type =
    //   stage == "0"
    //     ? this.filterParams.type
    //     : stage.split(",").map(function (item) {
    //         return parseInt(item, 10);
    //       });
    // let datePipe = new DatePipe("en-US");
    // let startDate = datePipe.transform(
    //   // this.filterFormGroup.get("startDate").value,
    //   this.dateFilters.closeDateFrom,
    //   "MM/dd/yyyy"
    // );
    // let endDate = datePipe.transform(
    //   // this.filterFormGroup.get("endDate").value,
    //   this.dateFilters.closeDateTo,
    //   "MM/dd/yyyy"
    // );
    // this.filterParams.closeDateFrom = startDate ? startDate : "";
    // this.filterParams.closeDateTo = endDate ? endDate : "";

    // if (stage == "50") {
    //   this.closeDateExceeded = true;
    //   this.filterParams.type = [];
    // }
    let params = { type: '10,11', per_page: 0, orderBy: 'id', order: 'desc' }
    if (this.hasAccess(6)) {
      params['ownerId'] = this.ownerId
    }
    this.commonService.toggleLoading(true)
    this.loading = true
    this.storeBuilderService
      .getStoreRequestList(params)
      // .getStoreRequestList(this.filterParams, this.closeDateExceeded)
      .subscribe(
        // this.storeBuilderService.getStoreRequestList(name, startDate, endDate, 'date', 'desc', stage, null, mgrId).subscribe(
        (response) => {
          this.loading = false
          this.commonService.toggleLoading(false)
          this.dataSource = response.body.data;
          // this.filterParams.totalLength =
          //   JSON.parse(response.headers.get("Pagination")).totalItems || 0;
          // this.dataSource.forEach((element) => {
          //   var tempDate = new Date(Date.parse(element.createdDate));
          //   element.createdDate = tempDate.toLocaleString();
          // });
        },
        (error) => {
          this.dataSource = [];
          this.commonService.toggleLoading(false)
          // this.alertService.error(error);
        }
      );
  }

  goToReport(storeId) {
    switch (this.reportName) {
      case 'store-product-report':
        this.router.navigate(['../../store-product-list', storeId, this.reportName], { relativeTo: this.route })
        break;
      case 'store-order-report':
        this.router.navigate(['../../' + this.reportName, storeId,], { relativeTo: this.route })
        break;
      default:
        this.commonService.openErrorSnackBar("Invalid Report", "")
        break;
    }
  }

  hasAccess(roleId) {
    if (this.roles && this.roles.length) {
      if (this.roles.find(role => role.id == roleId))
        return true
      else
        return false
    }
    return true
  }
}
