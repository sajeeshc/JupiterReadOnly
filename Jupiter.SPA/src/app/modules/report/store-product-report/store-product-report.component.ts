import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-store-product-report',
  templateUrl: './store-product-report.component.html',
  styleUrls: ['./store-product-report.component.scss']
})
export class StoreProductReportComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private commonService: CommonService,
  ) { }

  storeId
  mapCode
  report

  ngOnInit() {
    this.storeId = this.route.snapshot.paramMap.get('storeId')
    this.mapCode = this.route.snapshot.paramMap.get('mapCode')
    this.getStoreProductReport()
    this.commonService.setPageHeader('Store Product Report')
  }

  getStoreProductReport() {
    this.commonService.toggleLoading(true)
    this.reportService.getStoreProductReport(this.storeId, this.mapCode).subscribe((res: any) => {
      this.commonService.toggleLoading(false)
      this.report = res.data
    }, err => {
      this.commonService.toggleLoading(false)
    })
  }
}
