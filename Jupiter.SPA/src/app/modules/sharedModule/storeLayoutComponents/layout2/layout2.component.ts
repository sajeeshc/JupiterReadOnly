import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-layout2',
  templateUrl: './layout2.component.html',
  styleUrls: ['./layout2.component.scss']
})
export class Layout2Component implements OnInit {

  @Input() layoutData: any;
  @Input() teamStoreId: number;

  productsByCategory = []
  // teamStoreId: number

  constructor(
    private storeService: StoreService,
    private router : Router
  ) { }

  ngOnInit() {
    // this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.getCatagoryWiseProducts()
  }

  getCatagoryWiseProducts() {
    this.storeService.getCategoriesWithProducts(this.teamStoreId).subscribe(
      (response) => {
        this.productsByCategory = response.data
      },
      (error) => {
        console.log(error)
      });
  }

  redirectToProductView(productId:any){
    this.router.navigateByUrl('/enduser/buyfromlivestore/productview/'+productId);
      }

}
