import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-view-layout1',
  templateUrl: './view-layout1.component.html',
  styleUrls: ['./view-layout1.component.scss']
})
export class ViewLayout1Component implements OnInit {

  @Input() layoutData: any;

  productsByCategory = []
  teamStoreId: any;
  noImagePlaceholder = "../../../../../assets/images/default-image.jpg"
  constructor(
    private storeService: StoreService,
    private router : Router
  ) { }

  ngOnInit() {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
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
    localStorage.setItem('teamStoreId', this.teamStoreId);
    this.router.navigateByUrl('/enduser/buyfromlivestore/productview/'+productId);
  }

}
