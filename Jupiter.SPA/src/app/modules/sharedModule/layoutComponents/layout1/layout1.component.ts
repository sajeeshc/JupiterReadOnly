import { Component, OnInit, Input } from '@angular/core';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-layout1',
  templateUrl: './layout1.component.html',
  styleUrls: ['./layout1.component.scss']
})
export class Layout1Component implements OnInit {

  @Input() layoutData: any;
  @Input() teamStoreId: number;

  productsByCategory = []
  // teamStoreId: number

  constructor(
    private storeService: StoreService
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
}
