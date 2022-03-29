import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { EnduserService } from 'src/app/core/services/enduser.service';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'my-organization',
  templateUrl: './my-organization.component.html',
  styleUrls: ['./my-organization.component.scss']
})
export class MyOrganizationComponent implements OnInit {


  organizationForm: FormGroup;
  departmentForm: FormGroup;
  allOrganizations: any[] = [];
  myOrganizations: any[] = [];
  orgNameFormControl = new FormControl()
  orgDeptForm = new FormGroup({
    organizationArray: new FormArray([])
  })
  filteredOrganizations: Observable<any[]>;
  stateArray: any[] = [];
  // departmentArray: any[] = [];
  institutionTypeArray: any[] = [];
  marketGroupArray: any[] = []

  constructor(
    private commonService: CommonService,
    private sharedService: SharedService,
    private endUserService: EnduserService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getAllOrganizations();
    // this.getAllDepartments();
    this.initializeDepartmentForm();
    this.initializeOrganizationForm();
    this.getStates();
    this.getInstitutionTypes();
    this.getMarketGroups();
  }

  createOrganization() {
    if (this.organizationForm.valid) {
      this.endUserService.createOrganization(this.organizationForm.value).subscribe(response => {
        if (response.statusCode == 200) {
          this.commonService.openSuccessSnackBar(response.message, "")
          this.allOrganizations.push(response.data);
          this.filteredOrganizations = this.orgNameFormControl.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            )
          // this.organizationSelected(response.data)
          this.initializeOrganizationForm()
        }
      })
      this.closeOrganizationModal()
    } else {
      document.getElementById("organizationForm").classList.add("was-validated")
      this.commonService.openErrorSnackBar("Fill all required fields", "")
    }
  }

  getOrganizations() {
    this.endUserService.getOrganizations().subscribe((response) => {
      this.myOrganizations = response.data || [];
      this.myOrganizations.forEach(org => {
        let modal = this.formBuilder.group({
          ...org
        })
        let formArr = this.orgDeptForm.get("organizationArray") as FormArray
        formArr.push(modal)
      })
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    })
  }

  getStates() {
    this.sharedService.getAllStates().subscribe(response => {
      if (response.data != null) {
        this.stateArray = response.data;
      }
    });
  }

  getInstitutionTypes() {
    this.sharedService.getInstituitionTypes().subscribe(response => {
      if (response.data != null) {
        this.institutionTypeArray = response.data;
      }
    });
  }

  getMarketGroups() {
    this.sharedService.getMarketAndGroups().subscribe(response => {
      if (response.data != null) {
        this.marketGroupArray = response.data;
      }
    });
  }

  getState(id) {
    return this.stateArray.find(state => state.id == id)
  }

  getInstitutionType(id) {
    let instType = this.institutionTypeArray.find(inst => inst.id == id)
    return instType ? instType.name : ''
  }

  getMarkets(marketGroupId) {
    let marketGrp = this.marketGroupArray.find(grp => grp.id == marketGroupId)
    return marketGrp ? marketGrp.departments : []
  }

  initializeDepartmentForm() {
    this.departmentForm = this.formBuilder.group({
      organizationId: new FormControl(),
      name: new FormControl('')
    });
  }

  initializeOrganizationForm() {
    this.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      institutionTypeId: ['', [Validators.required, Validators.min(0)]],
      address: ['', Validators.required],
      address1: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    })

  }

  getAllOrganizations() {

    this.endUserService.getAllOrganizations().subscribe(response => {
      if (response.data != null) {
        this.allOrganizations = response.data
        this.filteredOrganizations = this.orgNameFormControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          )
        this.getOrganizations()
      }
      else {
        this.commonService.openErrorSnackBar("Error while fetching organizations", "");
      }
    }, error => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }

  organizationSelected(selectedOrg) {
    if (selectedOrg != -1) {
      selectedOrg["departmentId"] = ""
      selectedOrg["marketGroupId"] = ""
      this.myOrganizations.push(selectedOrg)
      let formArr = this.orgDeptForm.get("organizationArray") as FormArray
      formArr.push(
        this.formBuilder.group({
          ...selectedOrg,
        }))
      formArr.controls.forEach((c: FormGroup) => {
        c.get("departmentId").setValidators([Validators.required, Validators.min(0)])
        c.get("marketGroupId").setValidators([Validators.required, Validators.min(0)])
      })
    }

  }

  marketGroupSelected(org: FormControl) {
    org.get("departmentId").patchValue("")
  }

  getDeptsByOrgId(orgId) {
    return this.allOrganizations.find(org => {
      return org.id == orgId
    }).userDepartments
  }

  closeDepartmentModal() {
    $("#addDepartmentModal").modal("hide")
    document.getElementById("addDepartmentModal").classList.remove("was-validated")
  }

  closeOrganizationModal() {
    this.initializeOrganizationForm()
    $("#addOrganizationModal").modal("hide")
    document.getElementById("organizationForm").classList.remove("was-validated")
  }

  openDepartmentModal(orgId) {
    this.departmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      organizationId: [orgId]
    })
    $("#addDepartmentModal").modal("show")
  }

  openOrganizationModal() {
    $("#addOrganizationModal").modal("show")
  }

  submit() {
    let model = this.orgDeptForm.get("organizationArray").value
    let invalidMarket = model.find(obj => {
      return !obj.departmentId || Number(obj.departmentId) < 0
    })
    let invalidMarketGroup = model.find(obj => {
      return !obj.marketGroupId || Number(obj.marketGroupId) < 0
    })
    if (invalidMarketGroup) {
      this.commonService.openErrorSnackBar("Remove unwanted organizations or select market group for all organizations", "");
    } else if (invalidMarket) {
      this.commonService.openErrorSnackBar("Remove unwanted organizations or select market for all organizations", "");
    } else {
      this.endUserService.updateUserDepartments(model).subscribe((response) => {
        if (response.status == 1) {
          this.myOrganizations = response.data;
          this.commonService.openSuccessSnackBar(response.message, "");
        }
      }, (error) => {
        this.commonService.openErrorSnackBar(error.message, "");
      })
    }
  }

  removeOrg(index) {
    let arr = this.orgDeptForm.get("organizationArray") as FormArray
    arr.removeAt(index);
  }

  addDepartment() {
    if (this.departmentForm.valid) {
      this.endUserService.updateDepartments(this.departmentForm.value).subscribe((response) => {
        if (response.status == 1) {
          let index = this.allOrganizations.findIndex(org => {
            return org.id == response.data.organizationId
          })
          delete response.data.organizationId
          this.allOrganizations[index].userDepartments.push(response.data)
          this.commonService.openSuccessSnackBar(response.message, "");
          this.closeDepartmentModal()
        }
      }, (error) => {
        this.commonService.openErrorSnackBar(error.message, "");
      })
    } else {
      this.commonService.openErrorSnackBar("Please enter department name", "");
    }
  }

  private _filter(value: string): string[] {
    const filterValue = typeof (value) == 'string' ? value.toLowerCase() : ''

    return this.allOrganizations.filter(org => org.name.toLowerCase().includes(filterValue));
  }

  // getAllDepartments() {
  //   this.endUserService.getAllUserDepartments().subscribe(res => {
  //     this.departmentArray = res.data
  //   })
  // }
}
