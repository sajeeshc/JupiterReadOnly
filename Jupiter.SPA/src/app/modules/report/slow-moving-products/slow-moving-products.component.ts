import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-slow-moving-products',
  templateUrl: './slow-moving-products.component.html',
  styleUrls: ['./slow-moving-products.component.scss']
})
export class SlowMovingProductsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private commonService: CommonService,
  ) { }

  storeId
  dataSource
  loading = false

  ngOnInit() {
    this.storeId = this.route.snapshot.paramMap.get('storeId')
    this.commonService.setPageHeader("Slow Moving Products")
    this.getReport()
  }

  getReport(){
    this.loading = true
    this.commonService.toggleLoading(true)
    this.reportService.getSlowMovingProductReport(this.storeId).subscribe((res:any)=>{
      this.commonService.toggleLoading(false)
      this.loading = false
      this.dataSource = res.data
    },err=>{
      this.loading = false
      this.commonService.toggleLoading(false)
    })
  }

}
