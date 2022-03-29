import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss']
})
export class OrderReportComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private commonService: CommonService,
  ) { }

  orderId
  dataSource
  loading = false

  ngOnInit() {
    this.commonService.setPageHeader("Order Report")
    this.orderId = this.route.snapshot.paramMap.get('orderId')
    this.getOrderReport()
  }

  getOrderReport() {
    this.loading = true
    this.commonService.toggleLoading(true)
    this.reportService.getOrderReportWithStoreInfo(this.orderId).subscribe((res: any) => {
      this.loading = false
      this.commonService.toggleLoading(false)
      this.dataSource = res.data
    }, err => {
      this.loading = false
      this.commonService.toggleLoading(false)
    })
  }
}
