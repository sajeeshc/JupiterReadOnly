import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreManagerService } from 'src/app/core/services/store-manager.service';

@Component({
  selector: 'app-order-pending-payment',
  templateUrl: './order-pending-payment.component.html',
  styleUrls: ['./order-pending-payment.component.scss']
})
export class OrderPendingPaymentComponent implements OnInit {



  constructor(
    private storeManagerService: StoreManagerService,
    private commonServie: CommonService) { }

  filterParams = {
    orderId: '',
    customerName: '',
    institution: '',
    type: '',
    page: 1,
    per_page: 10,
    pageSizeOptions: [5, 10, 25, 100],
    totalLength: 0
  }
  dataSource: any;
  displayedColumns: string[] = [
    "orderId",
    "customerName",
    "institution",
    "type",
    "amount",
    "purchaseType",
    "document",
    "action"
  ];

  ngOnInit() {
    this.getPendingOrderList();
  }

  getPendingOrderList() {
    this.storeManagerService.getPendingOrderLIst(this.filterParams).subscribe(
      (response) => {
        this.dataSource = response.body.data;
        this.filterParams.totalLength = JSON.parse(response.headers.get("Pagination")).totalItems || 0
      },
      (error) => {
        // this.commonServie.openSuccessSnackBar(error.message,'');
      }
    );
  }

  approvePayment(id) {
    this.storeManagerService.approvePayment(id, 2).subscribe(//status = 2
      (response) => {
        this.commonServie.openSuccessSnackBar("Order approved successfully!", '');
        this.getPendingOrderList();
      },
      (error) => {
        this.commonServie.openErrorSnackBar(error.message, '');
      }
    );
  }

  rejectPayment(id) {
    this.storeManagerService.approvePayment(id, 3).subscribe(//reject = 3
      (response) => {
        this.commonServie.openSuccessSnackBar("Order rejected successfully!", '');
        this.getPendingOrderList();
      },
      (error) => {
        this.commonServie.openErrorSnackBar(error.message, '');
      }
    );
  }

  onPage(event) {
    this.filterParams.per_page = event.pageSize
    this.filterParams.page = event.pageIndex + 1
    this.getPendingOrderList()
  }
}
