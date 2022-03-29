import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { filter } from "rxjs/operators";
import { CommonService } from "src/app/core/services/common.service";
import { ProductService } from "src/app/core/services/product.service";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";

declare var $: any;

@Component({
  selector: "app-product-selection",
  templateUrl: "./product-selection.component.html",
  styleUrls: ["./product-selection.component.scss"],
})
export class ProductSelectionComponent implements OnInit {
  teamStoreId: number;
  garmentArray: any[] = [];
  selectedValue: any;
  edited: boolean;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private storeBuilderService: StorebuilderService,
    private router: Router,
    private commonService : CommonService
  ) { }

  ngOnInit () {
    // this.teamStoreId = parseInt(
    //   this.route.snapshot.paramMap.get("teamStoreId")
    // );
    this.commonService.setPageHeader('Product Selection');
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.getTeamStore(this.teamStoreId);
  }

  getTeamStore (teamStoreId) {
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe((response) => {
      var teamStore = response.data;
      this.garmentArray = teamStore.garmentsRequested;
      this.selectedValue = this.garmentArray[0];
      this.setImages();
    });
  }

  setImages () {
    $(".mainImgTab").attr("src", this.selectedValue.images[0].src);
  }

  onImgClick (source: string) {
    $(".mainImgTab").attr("src", source);
  }

  goToProductListing () {
    var baseUrl = this.router.url;
    var url = this.commonService.createUrl(baseUrl,'/storedetails/productspreadsheet',1);   
    this.router.navigateByUrl(url);
  }

  goToDesigner(){
    var baseUrl = this.router.url;
    var url = this.commonService.createUrl(baseUrl,'/designer/'+this.selectedValue.productId,1);   
    this.router.navigateByUrl(url);
  }
}
