import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss','../common-styles.scss']
})
export class ServicesComponent implements OnInit {

  
  servicesArray = []
  serviceForm: FormGroup
  isUpdate = false

  paginatorLength: number
  paginatorPageSize: number = 10
  paginatorPageSizeOptions: number[] = [5, 10, 25, 100]
  paginatorIndex: number = 0

  constructor(private productService: ProductService,
    private formBuilder: FormBuilder,
    private commonService : CommonService) { }

  ngOnInit() {
    this.initializeServicesForm()
    this.getServices()
  }

  initializeServicesForm() {
    this.serviceForm = this.formBuilder.group({
      id: 0,
      name: ['', Validators.required]
    })
    this.isUpdate = false
  }

  getServices() {
    let params = {
      page: (this.paginatorIndex + 1),
      per_page: this.paginatorPageSize,
    }
    this.productService.getAllProductServices(params).subscribe(res => {
      this.servicesArray = res.body.data
      this.paginatorLength = JSON.parse(res.headers.get("Pagination")).totalItems
    })
  }

  updateService() {
    if (this.serviceForm.valid) {
      this.productService.updateProductService(this.serviceForm.value).subscribe(res => {
        this.initializeServicesForm();
        this.getServices();
        this.commonService.openSuccessSnackBar(res.message,'')
      })
    }
    this.isUpdate = false
  }

  editService(item){
    this.isUpdate = true;
    this.serviceForm.setValue({
      id : item.id,
      name : item.name 
    });
  }

  removeService(id){
    Swal.fire({
      html: '<h5>Do you want to delete this service?</h5>',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.removeProductService(id).subscribe(res => {
          this.getServices();
          this.commonService.openSuccessSnackBar(res.message,'')
        })
      }
    })
  }

  pageEvent(event) {
    this.paginatorPageSize = event.pageSize
    this.paginatorIndex = event.pageIndex
    this.getServices();
  }

}
