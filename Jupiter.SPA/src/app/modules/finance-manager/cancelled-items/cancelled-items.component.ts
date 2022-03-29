import { Component, OnInit } from '@angular/core';
import { FinanceManagerService } from 'src/app/core/services/finance-manager.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-cancelled-items',
  templateUrl: './cancelled-items.component.html',
  styleUrls: ['./cancelled-items.component.scss']
})
export class CancelledItemsComponent implements OnInit {

  constructor(
    private finManService: FinanceManagerService,
    private commonService: CommonService,
  ) { }

  dataSource: any = [];
  displayedColumns: string[] = [
    "storeId",
    "storeName",
    "orderId",
    "customerName",
    "customerEmail",
    "refundedAmount",
    "storeCloseDate",
  ];

  filterParams = {
    storeId: '',
    storeName: '',
    orderId: '',
    customerName: '',
    customerEmail: '',
    storeCloseDate: '',
    page: 1,
    per_page: 10,
    pageSizeOptions: [5, 10, 25, 100],
    totalLength: 0
  }
  ngOnInit() {
    this.getCancelledSummery()
    this.commonService.setPageHeader("Cancelled Items")
  }

  getCancelledSummery() {
    this.finManService.getCancelledSummery(this.filterParams).subscribe((res: any) => {
      this.dataSource = res.body.data
      this.filterParams.totalLength = JSON.parse(res.headers.get("Pagination")).totalItems || 0
    })
  }

  onPage(event) {
    this.filterParams.per_page = event.pageSize
    this.filterParams.page = event.pageIndex + 1
    this.getCancelledSummery()
  }

}
