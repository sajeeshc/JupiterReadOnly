import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StoredetailsService } from 'src/app/core/services/storedetails.service';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {

  teamStoreId: number;
  productList: any[] = []
  filterFormGroup:FormGroup;

  constructor(
    private storeDetailsService: StoredetailsService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
    private formBuilder : FormBuilder,
    private storeService: StoreService) { }

  ngOnInit () {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    localStorage.setItem("teamStoreId", this.teamStoreId.toString());
    this.getProductList();
    this.createFilterFormGroup();
  }

  getProductList () {
    this.storeDetailsService.getStoreSpreadsheetList(this.teamStoreId).subscribe((response) => {
      this.productList = response;
    });
  }

  updateProductListing () {
    console.log(this.productList)

    this.storeDetailsService.updateStoreProductListing(this.teamStoreId, this.productList).subscribe(
      (response) => {
        if (response.status == 1) {
          this.commonService.openSuccessSnackBar(response.message, "");

        } else {
          this.commonService.openErrorSnackBar(response.message, "");
        }
      },
      (error) => {
        console.log(error);
        // this.storeRequestForm.controls['printColorsRequested'].setValue(colorList);
      }
    );
  }
  goBackToProductSelection (redirectionUrl) {
    var baseUrl = this.router.url;
    var url = this.commonService.createUrl(baseUrl, redirectionUrl, 3);
    this.router.navigateByUrl(url);
  }

  createFilterFormGroup(){
    this.filterFormGroup = this.formBuilder.group({
      name: new FormControl('')
    });
  }

  filter(){
    var name = this.filterFormGroup.get('name').value;
    this.storeService.getFilteredProductList(this.teamStoreId,name).subscribe(
      (response) => {
        this.productList = response.body;
      },
      (error) => {
        this.commonService.openErrorSnackBar(error.message, "");
      }
    );
  }

  clearFilters(){
    this.getProductList();
    this.filterFormGroup.get('name').setValue('');
  }



}
