import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-store-order-report',
  templateUrl: './store-order-report.component.html',
  styleUrls: ['./store-order-report.component.scss']
})
export class StoreOrderReportComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute,
    private commonService: CommonService,
  ) { }
  
  dataSource
  storeId
  loading = false
  ngOnInit() {
    this.commonService.setPageHeader("Store Order Report")
    this.storeId = this.route.snapshot.paramMap.get('storeId')
    this.getStoreOrderReport()
  }

  getStoreOrderReport() {
    this.commonService.toggleLoading(true)
    this.loading = true
    this.reportService.getStoreOrderReport(this.storeId).subscribe((res: any) => {
      this.loading = false
      this.commonService.toggleLoading(false)
      this.dataSource = res.data
    })
  }
}
