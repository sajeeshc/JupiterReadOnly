import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent implements OnInit {

  productList: any[]

  constructor(private storeService: StoreService) { }

  ngOnInit() {
    this.getFeaturedProducts()
  }

  getFeaturedProducts() {
    let params = {
      featured: true,
      per_page: 20,
      viewType: 2,
    }
    this.storeService.getProducts(params).subscribe(res => {
      this.productList = res.data
    },
      err => {
        console.log(err)
      })
  }



  gotoProduct(id) {
    window.parent.postMessage(id, "*");
  }

}