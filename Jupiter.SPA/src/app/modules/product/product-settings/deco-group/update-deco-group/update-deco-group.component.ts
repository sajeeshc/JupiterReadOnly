import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
declare var $: any

@Component({
  selector: 'app-update-deco-group',
  templateUrl: './update-deco-group.component.html',
  styleUrls: ['./update-deco-group.component.scss']
})
export class UpdateDecoGroupComponent implements OnInit {

  constructor(
    private commonServices: CommonService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
  ) { }

  decoGroupId = 0
  decoGroupForm: FormGroup
  productLocationArray = []
  servicesArray = []
  sizesArray = []
  filteredLocations: any
  autoCompleteText = new FormControl('')

  ngOnInit() {
    this.decoGroupId = Number(this.route.snapshot.params['decoGroupId'])
    if (this.decoGroupId)
      this.commonServices.setPageHeader("Update Deco Group")
    else
      this.commonServices.setPageHeader("Create Deco Group")

    this.getAvailableProductSizes()
    this.initializeDecoGroupForm()
    this.getProductLocations()
    this.getProductServices()
  }

  initializeDecoGroupForm() {
    this.decoGroupForm = this.fb.group({
      id: [0, Validators.required],
      name: ['', Validators.required],
      sizeConstraints: this.fb.array([]),
      locations: this.fb.array([]),
    })
  }

  initializeSizeConstraints() {
    if (this.decoGroupForm.get('sizeConstraints')['controls'].length == 0) {
      this.sizesArray.forEach(size => {
        this.createSizeConstraints(size)
      })
    }
  }

  createDecoGroupForm(data) {
    this.decoGroupForm = this.fb.group({
      id: [data.id, Validators.required],
      name: [data.name, Validators.required],
      sizeConstraints: this.fb.array([]),
      locations: this.fb.array([]),
    })

    data.locations.forEach(loc => {
      this.addLocation(loc)
    });

    this.sizesArray.forEach(size => {
      let constraintFound = null
      if (data.sizeConstraints)
        constraintFound = data.sizeConstraints.find(constraint => constraint.id == size.id)
      if (constraintFound) {
        this.createSizeConstraints(constraintFound)
      } else {
        this.createSizeConstraints(size)
      }
    });
  }

  getDecoGroup() {
    this.productService.getDecoGroup(this.decoGroupId).subscribe(res => {
      this.createDecoGroupForm(res.body.data)
    })
  }

  createSizeConstraints(data) {
    let arr = this.decoGroupForm.get('sizeConstraints') as FormArray
    arr.push(this.fb.group({
      id: [data.id, Validators.required],
      name: [data.name, Validators.required],
      heightConstraint: [data.heightConstraint || 1, Validators.required],
      widthConstraint: [data.widthConstraint || 1, Validators.required],
    }))
  }

  getProductLocations() {
    let params = {
      per_page: 0
    }
    this.productService.getAllProductLocations(params).subscribe(res => {
      this.productLocationArray = res.body.data;
      this.filteredLocations = this.autoCompleteText.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    })
  }

  getProductServices() {
    this.productService.getAllProductServices({ per_page: 0 }).subscribe(res => {
      this.servicesArray = res.body.data;
    })
  }

  getAvailableProductSizes() {
    this.productService.getAllAvailableSizes().subscribe(
      (response) => {
        this.sizesArray = response.sizes;
        this.initializeSizeConstraints()
        if (this.decoGroupId)
          this.getDecoGroup()
      }
    );
  }

  addLocation(data) {
    if (data.option)
      data = data.option.value
    let arr = this.decoGroupForm.get("locations") as FormArray
    arr.push(this.fb.group({
      id: [data.id, Validators.required],
      name: [data.name, Validators.required],
      services: [data.services, Validators.required],
      recommendedConstraintHeight: [data.recommendedConstraintHeight || '', Validators.required],
      recommendedConstraintWidth: [data.recommendedConstraintWidth || '', Validators.required],
      actualConstraintHeight: [data.actualConstraintHeight || '', Validators.required],
      actualConstraintWidth: [data.actualConstraintWidth || '', Validators.required],
      sepsPlacement: [data.sepsPlacement || '', Validators.required],
    }))
    this.autoCompleteText.setValue('')
    $('.table').focus()
  }

  removeLocation(i) {
    let arr = this.decoGroupForm.controls['locations'] as FormArray
    arr.removeAt(i)
  }

  submit() {
    // console.log(this.decoGroupForm)
    if (this.decoGroupForm.valid) {
      this.productService.updateDecoGroup(this.decoGroupForm.value).subscribe(res => {
        if (this.decoGroupId)
          this.commonServices.openSuccessSnackBar("Deco group updated successfully", "")
        else
          this.commonServices.openSuccessSnackBar("Deco group created successfully", "")
        this.goBack()
      })
    } else {
      this.commonServices.openErrorSnackBar("All values are required", "")
    }
  }

  attributeDisplay(attribute1, attribute2) {
    if (attribute1.id == attribute2.id) {
      return attribute1.name;
    } else {
      return "";
    }
  }

  goBack() {
    this.router.navigateByUrl("productmanager/settings/decogroup")
  }

  displayFn(option): string {
    return option && option.name ? option.name : '';
  }

  private _filter(name) {
    const filterValue = name.length ? name.toLowerCase() : ''
    return this.productLocationArray.filter(location => {
      if (this.decoGroupForm.value.locations.length)
        return location.name.toLowerCase().includes(filterValue) && !this.decoGroupForm.value.locations.find(loc => loc.id == location.id)
      else
        return location.name.toLowerCase().includes(filterValue)
    })
  }

}
