import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deco-positions',
  templateUrl: './deco-positions.component.html',
  styleUrls: ['./deco-positions.component.scss','../common-styles.scss']
})
export class DecoPositionsComponent implements OnInit {

  productLocationArray = []
  locationForm: FormGroup
  updateLocation = false

  paginatorLength: number
  paginatorPageSize: number = 10
  paginatorPageSizeOptions: number[] = [5, 10, 25, 100]
  paginatorIndex: number = 0

  constructor(private productService: ProductService,
    private formBuilder: FormBuilder,
    private commonService : CommonService) { }

  ngOnInit() {
    this.initializeLocationForm()
    this.getProductLocations()
  }

  initializeLocationForm() {
    this.locationForm = this.formBuilder.group({
      id: 0,
      name: ['', Validators.required]
    })
    this.updateLocation = false
  }

  getProductLocations() {
    let params = {
      page: (this.paginatorIndex + 1),
      per_page: this.paginatorPageSize,
    }
    this.productService.getAllProductLocations(params).subscribe(res => {
      this.productLocationArray = res.body.data;
      this.paginatorLength = JSON.parse(res.headers.get("Pagination")).totalItems;
    })
  }

  updateProductLocation() {
    if (this.locationForm.valid) {
      this.productService.updateProductLocation(this.locationForm.value).subscribe(res => {
        this.initializeLocationForm();
        this.getProductLocations();
        this.commonService.openSuccessSnackBar(res.message,'')
      })
    }
    this.updateLocation = false
  }

  editLocation(item){
    this.updateLocation = true;
    this.locationForm.setValue({
      id : item.id,
      name : item.name 
    });
  }

  removeLocation(id){
    Swal.fire({
      html: '<h5>Do you want to delete this location?</h5>',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.removeProductLocation(id).subscribe(res => {
          this.getProductLocations();
          this.commonService.openSuccessSnackBar(res.message,'')
        })
      }
    })
  }

  pageEvent(event) {
    this.paginatorPageSize = event.pageSize
    this.paginatorIndex = event.pageIndex
    this.getProductLocations();
  }

}
