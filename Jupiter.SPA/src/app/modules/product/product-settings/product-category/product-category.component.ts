import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import Swal from 'sweetalert2'
declare var $: any

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss', '../common-styles.scss']
})
export class ProductCategoryComponent implements OnInit {

  productCategoryArray = []
  categoryForm: FormGroup
  updateCategory = false
  loading = false
  productList = []
  productParams
  selectedCategory
  paginatorLength: number
  paginatorPageSize: number = 10
  paginatorPageSizeOptions: number[] = [5, 10, 25, 100]
  paginatorIndex: number = 0

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.resetProductParams()
    this.initializeCategoryForm()
    this.getProductCategory()
  }

  resetProductParams(categoryId?) {
    this.productParams = {
      page: 1,
      per_page: 10,
      totalItems: 0,
      filter: { categories: (categoryId || 0) }
    }
  }

  initializeCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: 0,
      name: ['', Validators.required]
    })
    this.updateCategory = false
  }

  getProductCategory() {
    let params = {
      page: (this.paginatorIndex + 1),
      per_page: this.paginatorPageSize,
    }
    this.productService.getAllProductCategory(params).subscribe(res => {
      this.productCategoryArray = res.body.data
      this.paginatorLength = JSON.parse(res.headers.get("Pagination")).totalItems
    })
  }

  updateProductCategory() {
    if (this.categoryForm.valid) {
      this.productService.updateProductCategory(this.categoryForm.value).subscribe(res => {
        this.initializeCategoryForm();
        this.getProductCategory();
        this.commonService.openSuccessSnackBar(res.message, '')
      })
    }
    this.updateCategory = false
  }

  editCategory(item) {
    this.updateCategory = true;
    this.categoryForm.setValue({
      id: item.id,
      name: item.name
    });
  }

  removeCategory(categoryId) {
    Swal.fire({
      html: '<h5>Do you want to delete this category?</h5>',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.removeProductCategory(categoryId).subscribe(res => {
          this.getProductCategory();
          this.commonService.openSuccessSnackBar(res.message, '')
        })
      }
    })
  }

  pageEvent(event) {
    this.paginatorPageSize = event.pageSize
    this.paginatorIndex = event.pageIndex
    this.getProductCategory();
  }

  viewProducts(category) {
    if (this.productParams.filter.categories != category.id) {
      this.productList = []
      this.resetProductParams(category.id)
      this.getProducts()
    }
    this.selectedCategory = category.name
    $('.products-modal').modal('show')
  }

  getProducts() {
    this.loading = true
    this.productService.getProducts(this.productParams).subscribe((res: any) => {
      this.productList = res.body.data
      this.loading = false
      this.productParams.totalItems = JSON.parse(res.headers.get("Pagination")).totalItems
    })
  }

  onProductPageEvent(event) {
    this.productParams.page = event.pageIndex + 1
    this.productParams.per_page = event.pageSize
    this.getProducts()
  }
}
