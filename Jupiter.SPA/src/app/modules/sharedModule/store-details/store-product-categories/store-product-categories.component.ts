import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/core/services/common.service";
import { StoreService } from "src/app/core/services/store.service";
import { StoredetailsService } from "src/app/core/services/storedetails.service";
declare var $: any;

@Component({
  selector: "app-store-product-categories",
  templateUrl: "./store-product-categories.component.html",
  styleUrls: ["./store-product-categories.component.scss"],
})
export class StoreProductCategoriesComponent implements OnInit {
  teamStoreId: any;
  categoryName: string;
  categoryArray: any = [];
  productList: any = [];
  selectedCategory: any;
  selectedCategoryIndex: any;
  productIds: any = [];

  constructor(
    private storeService: StoreService,
    private storeDetailsService: StoredetailsService,
    private commonService: CommonService
  ) { }

  ngOnInit () {
    this.teamStoreId = localStorage.getItem("teamStoreId");
    this.getCategoriesWithProducts();
    this.getProductList();

    $ ('#addCategoryModal').on ("hidden.bs.modal", function () {
      this.categoryName = '';
    });
  }

  getCategoriesWithProducts () {
    this.storeService.getCategoriesWithProducts(this.teamStoreId).subscribe(
      (response) => {
        this.categoryArray = response.data;

      },
      (error) => {
        this.commonService.openErrorSnackBar(error.message, '');
      }
    );
  }

  getProductList () {
    this.storeDetailsService.getStoreSpreadsheetList(this.teamStoreId).subscribe((response) => {
      this.productList = response.data;
    });
  }

  openProductModal (obj, index) {
    this.productIds = [];
    this.selectedCategory = obj;
    this.categoryName = obj.categoryName;
    this.selectedCategoryIndex = index;
    if (obj.products) {
      for (let product of obj.products) {
        this.productIds.push(product.id);
      }
    }
    $("#addProductModal").modal("show");
  }

  SaveCategory () {
    if (this.categoryName != null && this.categoryName != '') {
      let obj = {
        categoryId: 0,
        categoryName: this.categoryName
      };
      $("#addCategoryModal").modal('hide');
      this.storeService.createProductCategory(obj, this.teamStoreId).subscribe(
        (response) => {
          if (response.status == 1) {
            this.commonService.openSuccessSnackBar(response.message, '');
            this.selectedCategory = response.data;
            this.selectedCategoryIndex = this.categoryArray.length;
            this.categoryArray.push(response.data);
            $("#addProductModal").modal('show');
          }
          else {
            $("#addCategoryModal").modal('hide');
            this.commonService.openErrorSnackBar(response.message, '');
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {
      this.commonService.openWarningSnackBar('Please enter a category name', '');
    }

  }

  updateCategory () {
    let obj = {
      categoryId: this.selectedCategory.categoryId,
      categoryName: this.categoryName,
      productIds: this.productIds
    };
    let arr = [obj];
    this.storeService.updateProductCategory(arr, this.teamStoreId).subscribe(
      (response) => {
        var result = response;
        if (result.status == 1) {
          this.commonService.openSuccessSnackBar(response.message, '');
          this.categoryArray[this.selectedCategoryIndex] = response.data[this.selectedCategoryIndex];
          this.close();
        }
        else {
          this.commonService.openErrorSnackBar(response.message, '');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  productSelected (event, item) {
    if (event.srcElement.checked) {
      this.productIds.push(Number(item.id));
    } else {
      const index = this.productIds.indexOf(item.id);
      if (index > -1) {
        this.productIds.splice(index, 1);
      }
    }
  }

  deleteCategory (obj, index) {
    this.selectedCategory = obj;
    this.selectedCategoryIndex = index;
    $("#deleteConfirmationModal").modal('show');
  }

  confirmDelete () {
    this.storeService.deleteCategory(this.selectedCategory.categoryId).subscribe(
      (response) => {
        var result = response;
        if (result.status == 1) {
          this.categoryArray.splice(this.selectedCategoryIndex, 1);
          this.close();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  close () {
    this.productIds = [];
    this.selectedCategory = [];
    this.selectedCategoryIndex = null;
    this.categoryName = '';
    $("#addCategoryModal").modal('hide');
    $("#addProductModal").modal("hide");
    $("#deleteConfirmationModal").modal('hide');
  }

  
}
