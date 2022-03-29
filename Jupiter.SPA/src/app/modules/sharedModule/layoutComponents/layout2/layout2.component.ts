import { Component, OnInit, Input } from '@angular/core';
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
