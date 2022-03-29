import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';

import { saveAs } from "file-saver";
import { FinanceManagerService } from 'src/app/core/services/finance-manager.service';
const XLSX = require('xlsx');
const moment = require('moment')

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.scss']
})
export class FinancialReportComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private finManService: FinanceManagerService
  ) { }

  fromDate: Date = moment().subtract(7, 'days').toDate()
  toDate: Date = moment().toDate()

  dataSource: any = [];
  displayedColumns: string[] = [
    "orderId",
    "customerName",
    "createdDate",
    "amount",
    "store",
    "authCode",
  ];

  ngOnInit() {
    this.commonService.setPageHeader("Financial Report")
    this.getFinancialReportData()
  }

  getFinancialReportData(type?) {

    let params = {
      per_page: '0',
      page: '1',
      startDate: moment(this.fromDate).format('MM/DD/yyyy'),
      endDate: moment(this.toDate).format('MM/DD/yyyy'),
    }

    this.finManService.getFinancialReport(params).subscribe(res => {
      console.log(res)
      if (type && type == 1) {
        return res.body.data
      } else {
        this.dataSource = res.body.data
      }
    })

  }

  exportToExcel() {
    let wb = XLSX.utils.book_new();
    let heading = [
      "Order Id",
      "Customer Name",
      "Order Date",
      "Amount",
      "Store",
      "Authorization Code",
    ];
    // const data = this.getFinancialReportData(1)
    // const data = this.dataSource.map(row => {
    //   row["amount"] = "0"
    //   return row
    // })
    let ws = XLSX.utils.json_to_sheet(this.dataSource, { header: this.displayedColumns, skipHeader: 1, origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, [heading]);
    XLSX.utils.book_append_sheet(wb, ws, "financial-report");

    let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "financial-report.xlsx");
  }

}
