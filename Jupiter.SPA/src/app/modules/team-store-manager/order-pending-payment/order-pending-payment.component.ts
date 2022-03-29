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

  dataSource: any;

  constructor( private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private storeManagerService : StoreManagerService,
    private commonServie : CommonService) { }

    displayedColumns: string[] = [
      "orderId",
      "customerName",
      "institution",
      "amount",
      "type",
      "purchaseType",
      "document",
      "action"
    ];

  ngOnInit() {
    this.getPendingOrderList();
  }

  getPendingOrderList () {
    this.storeManagerService.getPendingOrderLIst().subscribe(
      (response) => {
        this.dataSource = response.body.data;
      },
      (error) => {
        this.commonServie.openSuccessSnackBar(error.message,'');
      }
    );
  }

  approvePayment(id){
    this.storeManagerService.approvePayment(id,2).subscribe(//status = 2
      (response) => {
        this.commonServie.openSuccessSnackBar("Order approved successfully!",'');
        this.getPendingOrderList();
      },
      (error) => {
        this.commonServie.openErrorSnackBar(error.message,'');
      }
    );
  }

  rejectPayment(id){
    this.storeManagerService.approvePayment(id,3).subscribe(//reject = 3
      (response) => {
        this.commonServie.openSuccessSnackBar("Order rejected successfully!",'');
        this.getPendingOrderList();
      },
      (error) => {
        this.commonServie.openErrorSnackBar(error.message,'');
      }
    );
  }
}
