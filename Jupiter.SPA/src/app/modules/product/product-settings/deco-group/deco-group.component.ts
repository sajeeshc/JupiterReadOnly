import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';

declare var $: any
import Swal from 'sweetalert2'

@Component({
  selector: 'app-deco-group',
  templateUrl: './deco-group.component.html',
  styleUrls: ['./deco-group.component.scss', '../common-styles.scss']
})
export class DecoGroupComponent implements OnInit {

  decoGroups = []
  productLocationArray = []
  servicesArray = []
  selectedDecoGroup: any = {}

  paginatorLength: number
  paginatorPageSize: number = 10
  paginatorPageSizeOptions: number[] = [5, 10, 25, 100]
  paginatorIndex: number = 0

  productList = []
  loading
  productParams

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.resetProductParams()
    this.getProductLocations()
    this.getDecoGroups()
    this.getProductServices()
  }

  removeLocation(id) {
    this.selectedDecoGroup['locations'] = this.selectedDecoGroup['locations'].filter(loc => {
      return loc.id != id
    })
  }

  createLocation() {
    return this.formBuilder.group({
      id: '',
      name: '',
      services: [],
    })
  }

  createLocationArray(locationArray: any[]) {
    let locationFromArray: FormArray = this.formBuilder.array([])
    locationArray.forEach(element => {
      locationArray.push(this.formBuilder.group({
        id: element.id,
        name: element.name,
        services: this.formBuilder.control(element.services)
      }))
    });
    return locationFromArray
  }

  getProductLocations() {
    let params = {
      per_page: 0
    }
    this.productService.getAllProductLocations(params).subscribe(res => {
      this.productLocationArray = res.body.data;
    })
  }

  getDecoGroups() {
    let params = {
      per_page: this.paginatorPageSize,
      page: this.paginatorIndex + 1
    }
    this.productService.getAllDecoGroups(params).subscribe(res => {
      this.decoGroups = res.body.data
      this.paginatorLength = JSON.parse(res.headers.get("Pagination")).totalItems;
    })
  }

  getProductServices() {
    this.productService.getAllProductServices({ per_page: 0 }).subscribe(res => {
      this.servicesArray = res.body.data;
    })
  }

  openDecoGroupPopup(grp) {
    this.selectedDecoGroup = { ...grp }
    $("#decoGroupModal").modal('show')
  }

  attributeDisplay(attribute1, attribute2) {
    if (attribute1 && attribute2) {
      if (attribute1.id == attribute2.id) {
        return attribute1.name;
      }
    }
    return "";
  }

  submit() {
    this.productService.updateDecoGroup(this.selectedDecoGroup).subscribe(res => {
      if (this.selectedDecoGroup['id'] == 0) {
        this.commonService.openSuccessSnackBar("Deco group created successfully", "")
        this.selectedDecoGroup['id'] = res.data
        const temp = [...this.decoGroups, this.selectedDecoGroup]
        this.decoGroups = temp.map(grp => { return grp })
      } else {
        this.commonService.openSuccessSnackBar("Deco group updated successfully", "")
        let index = this.decoGroups.findIndex(grp => {
          return grp.id == this.selectedDecoGroup['id']
        })

        if (index >= 0)
          this.decoGroups.splice(index, 1, this.selectedDecoGroup)
      }
      this.selectedDecoGroup = {}
      $("#decoGroupModal").modal('hide')

    })
  }

  deleteDecoGroup(id) {
    Swal.fire({
      html: "<h5>Do you want to delete this deco group?</h5>",
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then(res => {
      if (res.isConfirmed) {
        this.productService.deleteDecoGroup(id).subscribe(res => {
          this.commonService.openSuccessSnackBar("Deco group deleted successfully", "")
          this.decoGroups = this.decoGroups.filter(grp => {
            return grp.id != id
          })
        })
      }
    })
  }
  pageEvent(event) {
    this.paginatorPageSize = event.pageSize
    this.paginatorIndex = event.pageIndex
    this.getDecoGroups();
  }

  viewDecoGroupProducts(grp) {
    this.selectedDecoGroup = grp
    this.resetProductParams()
    this.productList = []
    this.getProducts()
    $('.products-modal').modal('show')
  }

  onProductPageEvent(event) {
    this.productParams.page = event.pageIndex + 1
    this.productParams.per_page = event.pageSize
    this.getProducts()
  }

  getProducts() {
    this.loading = true
    this.productService.getProducts(this.productParams).subscribe((res: any) => {
      this.productList = res.body.data
      this.loading = false
      this.productParams.totalItems = JSON.parse(res.headers.get("Pagination")).totalItems
    })
  }

  resetProductParams() {
    this.productParams = {
      page: 1,
      per_page: 10,
      totalItems: 0,
      filter: { decoGroups: (this.selectedDecoGroup.id || 0) }
    }
  }
}
