import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-store-status',
  templateUrl: './store-status.component.html',
  styleUrls: ['./store-status.component.scss','../common-styles.scss']
})
export class StoreStatusComponent implements OnInit {

  constructor(private productService: ProductService) { }

  
  paginatorLength: number
  paginatorPageSize: number = 10
  paginatorPageSizeOptions: number[] = [5, 10, 25, 100]
  paginatorIndex: number = 0
  statusArray = []

  ngOnInit() {
    this.getStoreStatus()
  }


  getStoreStatus() {
    let params = {
      page: (this.paginatorIndex + 1),
      per_page: this.paginatorPageSize,
    }
    this.productService.getAllProductStatuses(params).subscribe(res => {
      this.statusArray = res.body.data
      this.paginatorLength = JSON.parse(res.headers.get("Pagination")).totalItems
    })
  }
}
