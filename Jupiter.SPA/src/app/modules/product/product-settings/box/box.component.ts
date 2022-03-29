import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';

declare var $: any
const Swal = require('sweetalert2')

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss', '../common-styles.scss']
})
export class BoxComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private productService: ProductService,
  ) { }
  
  boxArray = []
  boxForm: FormGroup
  isUpdate = false

  paginatorLength: number
  paginatorPageSize: number = 10
  paginatorPageSizeOptions: number[] = [5, 10, 25, 100]
  paginatorIndex: number = 0

  ngOnInit() {
    this.initializeForm() 
    this.getBoxList()
  }
  initializeForm() {
    this.boxForm = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      length: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],
      ect: ['', Validators.required],
      volume: ['', Validators.required],
    })
  }

  getBoxList() {
    let params = {
      page: (this.paginatorIndex + 1),
      per_page: this.paginatorPageSize,
    }
    this.productService.getAlBox({}).subscribe(res => {
      this.boxArray = res.body.data
      this.paginatorLength = JSON.parse(res.headers.get("Pagination")).totalItems;
    })
  }

  openEditPopup(box) {
    this.boxForm = this.formBuilder.group({
      id: [box.id],
      name: [box.name, Validators.required],
      length: [box.length, Validators.required],
      width: [box.width, Validators.required],
      height: [box.height, Validators.required],
      ect: [box.ect, Validators.required],
      volume: [box.volume, Validators.required],
    })
    this.isUpdate = true
    $('#boxModal').modal("show")
  }

  openAddPopup() {
      $('#boxModal').modal("show")
  }

  saveBox() {
    if (this.boxForm.valid) {
      this.productService.saveBox(this.boxForm.value).subscribe(res => {
        if (this.isUpdate) {
          this.commonService.openSuccessSnackBar("Box updated successfully", "")
          let i = this.boxArray.findIndex(box=>{return box.id == this.boxForm.value.id})
          this.boxArray.splice(i,1,this.boxForm.value)
        } else {
          this.commonService.openSuccessSnackBar("Box added successfully", "")
          this.boxForm.get('id').setValue(res.data)
          this.boxArray.unshift(this.boxForm.value)
        }
        this.closePopup()
      })
    }
  }

  removeBox(id,i){
    Swal.fire({
      html: '<h5>Do you want to delete this box?</h5>',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteBox(id).subscribe(res => {
          this.commonService.openSuccessSnackBar("Box deleted successfully",'')
          this.boxArray.splice(i,1)
        })
      }
    })
  }

  closePopup() {
    this.isUpdate = false
    this.initializeForm()
    $('#boxModal').modal("hide")
  }

  pageEvent(event) {
    this.paginatorPageSize = event.pageSize
    this.paginatorIndex = event.pageIndex
    this.getBoxList();
  }

}
