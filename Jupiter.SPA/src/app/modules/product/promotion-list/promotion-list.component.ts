import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.scss']
})
export class PromotionListComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router, private commonService: CommonService) { }

  promotionList = []
  products = []
  displayedColumns: string[] = [
    "id",
    "name",
    "description",
    "price",
    "startDate",
    "endDate",
    "status",
    "action"
  ];
  ngOnInit() {
    this.commonService.setPageHeader("Promotion List")
    this.getAllPromotions()
  }

  getAllPromotions() {
    this.productService.getAllPromotions({}).subscribe(res => {
      this.promotionList = res.body.data
    })
  }

  showProducts(i) {
    this.products = this.promotionList[i].products
  }

  editPromotion(id) {
    this.router.navigateByUrl('/productmanager/promotion?id=' + id)
  }

  deactivate(id, i) {

  }
}
