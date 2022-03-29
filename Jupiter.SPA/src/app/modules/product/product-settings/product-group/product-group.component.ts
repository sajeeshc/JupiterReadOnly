import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.component.html',
  styleUrls: ['./product-group.component.scss','../common-styles.scss']
})
export class ProductGroupComponent implements OnInit {

  productGroupArray = []
  groupForm: FormGroup
  updateGroup = false

  paginatorLength: number
  paginatorPageSize: number = 10
  paginatorPageSizeOptions: number[] = [5, 10, 25, 100]
  paginatorIndex: number = 0

  constructor(private productService: ProductService,
    private formBuilder: FormBuilder,
    private commonService : CommonService) { }

  ngOnInit() {
    this.initializeGroupForm()
    this.getProductGroups()
  }

  initializeGroupForm() {
    this.groupForm = this.formBuilder.group({
      id: 0,
      name: ['', Validators.required]
    })
    this.updateGroup = false
  }

  getProductGroups() {
    let params = {
      page: (this.paginatorIndex + 1),
      per_page: this.paginatorPageSize,
    }
    this.productService.getAllProductGroups(params).subscribe(res => {
      this.productGroupArray = res.body.data
      this.paginatorLength = JSON.parse(res.headers.get("Pagination")).totalItems
    })
  }

  updateProductGroup() {
    if (this.groupForm.valid) {
      this.productService.updateProductGroup(this.groupForm.value).subscribe(res => {
        this.initializeGroupForm();
        this.getProductGroups();
        this.commonService.openSuccessSnackBar(res.message,'')
      })
    }
    this.updateGroup = false
  }

  editGroup(item){
    this.updateGroup = true;
    this.groupForm.setValue({
      id : item.id,
      name : item.name 
    });
  }

  removeGroup(id){
    Swal.fire({
      html: '<h5>Do you want to delete this group?</h5>',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.removeProductGroup(id).subscribe(res => {
          this.getProductGroups();
          this.commonService.openSuccessSnackBar(res.message,'')
        })
      }
    })
  }

  pageEvent(event) {
    this.paginatorPageSize = event.pageSize
    this.paginatorIndex = event.pageIndex
    this.getProductGroups();
  }

}
