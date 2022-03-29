import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StoreCartService } from 'src/app/core/services/storeCart.service';

@Component({
  selector: 'app-review-products',
  templateUrl: './review-products.component.html',
  styleUrls: ['./review-products.component.scss']
})
export class ReviewProductsComponent implements OnInit {

  teamStoreId: number;
  optionalParams: any={};
  storeProductsObj: any={};
  storeProducts: any[]=[];
  filterFormGroup:FormGroup;

  constructor(private storeCartService: StoreCartService,
    private commonService: CommonService,
    private formBuilder : FormBuilder,
    private storeService: StoreService) { }

  ngOnInit() {
    this.teamStoreId= parseInt(localStorage.getItem("teamStoreId"));
    this.getTeamStoreProducts();
    this.createFilterFormGroup();
  }


  getTeamStoreProducts(){
    this.storeCartService.getTeamStoreProducts(this.teamStoreId).subscribe(
      (response) => {
        this.storeProducts= response.data;
        console.log(this.storeProducts);
      },
      (error) => {
        console.log(error);

      }
    );
  }

  createFilterFormGroup(){
    this.filterFormGroup = this.formBuilder.group({
      name: new FormControl('')
    });
  }

  filter(){
    var name = this.filterFormGroup.get('name').value;
    this.storeCartService.getTeamStoreProducts(this.teamStoreId,name).subscribe(
      (response) => {
        this.storeProducts = response.data;
      },
      (error) => {
        this.commonService.openErrorSnackBar(error.message, "");
      }
    );
  }

  clearFilters(){
    this.getTeamStoreProducts();
    this.filterFormGroup.get('name').setValue('');
  }

}
