import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoredetailsService } from 'src/app/core/services/storedetails.service';

@Component({
  selector: 'app-store-product-list',
  templateUrl: './store-product-list.component.html',
  styleUrls: ['./store-product-list.component.scss']
})
export class StoreProductListComponent implements OnInit {

  constructor(
    private storeDetailsService: StoredetailsService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
  ) { }

  reportName
  storeId
  productList = []
  loading = false

  ngOnInit() {
    this.reportName = this.route.snapshot.paramMap.get('reportName')
    this.storeId = this.route.snapshot.paramMap.get('storeId')
    this.getProductList()
    this.commonService.setPageHeader("Store Product List")
  }

  getProductList() {
    this.commonService.toggleLoading(true)
    this.loading = true
    this.storeDetailsService.getStoreSpreadsheetList(this.storeId).subscribe((response) => {
      this.loading = false
      this.commonService.toggleLoading(false)
      this.productList = response.data;
    }, err=>{
      this.loading = false
      this.commonService.toggleLoading(false)
    });
  }

  goToReport(mapCode) {
    this.router.navigate(['../../../' + this.reportName, this.storeId, mapCode], { relativeTo: this.route })
  }
}
