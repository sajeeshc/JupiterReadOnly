import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";
import { ProductService } from 'src/app/core/services/product.service';

declare var $: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productId: any;
  product: any;
  selectedColor
  noImage = "../../../../assets/images/no-image.jpg"
  loading = true
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private productService: ProductService
  ) { }

  ngOnInit () {
    this.productId = parseInt(this.route.snapshot.paramMap.get('productId'));
    this.getProductDetail();
    window.parent.postMessage("resize window -"+window.outerHeight, "*");
  }

  getProductDetail () {

    this.productService.getProductDetail(this.productId).subscribe(response => {
      this.product = response.products;
      this.selectedColor = this.product.variants[0]
      this.loading = false
    },
      error => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
  }

  onImgClick (src) {
    $(".img-holder").attr("src", src);
  }

  gotoProductView () {
    localStorage.setItem("purchaseType", '1');
    let url = '/enduser/directpurchase/productview/' + this.productId
    if(this.selectedColor)
      url = url + "-" + this.selectedColor.id
    this.router.navigateByUrl(url);
  }

  goToDesigner () {
    localStorage.setItem("purchaseType", '2');
    let url = '/enduser/directpurchase/designer/' + this.productId
    if(this.selectedColor)
      url = url + "-" + this.selectedColor.id
    this.router.navigateByUrl(url);
    this.router.navigateByUrl(url);
  }
}
