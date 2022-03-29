import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {
  @ViewChild('widgetsContent', { static: false }) widgetsContent: ElementRef;

  showSubItems: boolean = false;
  productList: any[] = [];
  categoryList: any[] = [
    // {id:0, name:"All"},
    {id:328, name:"Best Sellers"},
    {id:326, name:"Face Mask"},
    {id:57, name:"Accessories"},
    {id:234, name:"T-Shirt-snst350"},
    {id:6, name:"long sleeve"},
    {id:334, name:"hoodie sweatshirts"},
    {id:279, name:"1/4 Zip"},
    {id:17,name:"Polo"},
    {id:14, name:"Warm Up Jacket"},
    {id:15, name:"Warm Up Pant"},
    {id:27, name:"Sweatpants"},
    {id:5, name:"Shorts"},
    {id:272, name:"Sleeveless Jersey-CPBBJ9"},
    {id:53, name:"Uniform Pant"},
    {id:316, name:"Headband-BA0300"},
    {id:16, name:"Bag"},
  ];
  userId: string;
  token: string;
  categoryId: string;
  noImage = "../../../../assets/images/no-image.jpg"
  searchText = ''
  loading = false

  paginatorLength: number
  paginatorPageSize: number = 10
  paginatorPageSizeOptions: number[] = [5, 10, 25, 100]
  paginatorIndex: number = 0

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private productService: ProductService,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {

    let thisObj = {} = this;
    localStorage.setItem('teamStoreId', '0');
    let runCount = 0
    //Signal te parent
    window.parent.postMessage("loaded", "*")
    // listen for messages from the parent.
    window.addEventListener("message", function (e) {
      if (runCount === 0) {
        thisObj.categoryId = new String(e.data.categoryId).toString();
        thisObj.categoryId = thisObj.categoryId == 'undefined' ? '0' : thisObj.categoryId;
        thisObj.getProduct();
        runCount++
      }
      // thisObj.userId = new String(e.data.userid).toString();
      // thisObj.token = new String(e.data.usertoken).toString();
      // thisObj.userId = '49';
      // thisObj.token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI0OSIsInVuaXF1ZV9uYW1lIjoidXNlckBqdXBpdGVyLmNvbSIsImdpdmVuX25hbWUiOiJKb3NzIiwicm9sZSI6IkVuZFVzZXIiLCJuYmYiOjE2MjA2MjMyNTgsImV4cCI6MTYyMDcwOTY1OCwiaWF0IjoxNjIwNjIzMjU4fQ.Kr4nvap6_26uVa94Txb8DsXNYIQ1i7XjUoH-kPG7u-Xtjz2J3-9VJ1twWChSWjDfH_Kr9xZood-URSNRTfPTNQ';
      // if (thisObj.userId !== undefined) {
      // localStorage.setItem("userId", thisObj.userId);
      // localStorage.setItem("token", thisObj.token);


      // }
    }, false)

    // this.getProductCategory();

  }


  getProductCategory() {
    this.productService.getProductCategory().subscribe(
      (response) => {
        var result = response.body.data;
        this.categoryList = result.map(function (el) {
          var o = Object.assign({}, el);
          o.isExpanded = false;
          if (o.parent_id == 0)
            return o;
        })
      },
      (error) => {

      }
    );
  }

  toggleSubItems(item: any) {
    item.isExpanded = true ? item.isExpanded == false : true;
    this.categoryId = item.id
    this.getProduct();
  }

  getProduct() {
    this.loading = true
    let params = {
      categoryId: this.categoryId,
      page: (this.paginatorIndex + 1),
      per_page: this.paginatorPageSize,
      // viewType:2, 
      storeStatuses:'2,3',
      keyword: this.searchText,
    }
    this.productService.getProduct(params).subscribe(
      (response) => {
        this.productList = response.body.data;
        this.paginatorLength = JSON.parse(response.headers.get("Pagination")).totalItems
        this.loading = false
      },
      (error) => {
        this.productList = [];
        this.loading = false
        console.log(error)
      }
    );
  }

  goToProductDetails(product: any) {
    localStorage.setItem('productId', product.id);
    this.router.navigateByUrl('/enduser/directpurchase/productdetail/' + product.id);
  }

  category: {
    id: any,
    name: any,
    createdDate: any,
    parent_id: any,
    slug: any,
    subcategories: [],
    expanded: false
  };

  pageEvent(event) {
    this.paginatorPageSize = event.pageSize
    this.paginatorIndex = event.pageIndex
    this.getProduct();
  }

  scrollLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  }

  scrollRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }
}
