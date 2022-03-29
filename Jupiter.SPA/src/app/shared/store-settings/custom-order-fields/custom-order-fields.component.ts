import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/core/services/store.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonService } from 'src/app/core/services/common.service';
// import * as $ from 'jquery'
declare var $: any

@Component({
  selector: 'app-custom-order-fields',
  templateUrl: './custom-order-fields.component.html',
  styleUrls: ['./custom-order-fields.component.scss']
})
export class CustomOrderFieldsComponent implements OnInit {

  customCheckoutFields: FormGroup;
  teamStoreId: number;

  selectedCustomFields: any[] = []
  edit: boolean = false
  deleteIndex: number
  isMulitpleChoiceDropdownSelected: boolean = false

  multipleChoiceArray = []

  constructor(private formBuilder: FormBuilder, private readonly storeService: StoreService, private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));;
    this.setUpCustomCheckoutFieldsFormGroup();
    this.getCustomCheckoutFields();
  }

  setUpCustomCheckoutFieldsFormGroup() {
    this.customCheckoutFields = this.formBuilder.group({
      customFieldType: [0],
      isMandatory: new FormControl(''),
      fieldLabel: new FormControl('', Validators.required),
      fieldInstruction: new FormControl(''),
      multipleChoices: new FormControl('')
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedCustomFields, event.previousIndex, event.currentIndex);
  }

  getCustomCheckoutFields() {
    this.storeService.getStore(this.teamStoreId).subscribe(
      (response) => {
        this.selectedCustomFields = response.data.customFields
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openEditModal(i) {
    this.edit = true
    this.deleteIndex = i
    this.setCustomCheckoutFieldsValues(this.selectedCustomFields[i])
    this.isMulitpleChoiceDropdownSelected = this.selectedCustomFields[i].customFieldType == 1
    $('#customOrderFieldModal').modal('show')
  }

  openCreateModal() {
    this.edit = false
    this.isMulitpleChoiceDropdownSelected = false
    this.customCheckoutFields.reset({})
    this.setUpCustomCheckoutFieldsFormGroup();
    this.updateMultipleChoiceArray()
    $('#customOrderFieldModal').modal('show')
  }

  setDeleteIndex(i) {
    this.deleteIndex = i
  }

  deleteField() {
    this.selectedCustomFields.splice(this.deleteIndex, 1)
  }

  onTypeChange(event) {
    this.isMulitpleChoiceDropdownSelected = event.value == 1
    this.customCheckoutFields.get("multipleChoices").setValue(' ')
  }

  editField() {
    if (this.customCheckoutFields.status == 'VALID') {
      let choiceString = this.customCheckoutFields.get("multipleChoices").value.trim()
      let multipleChoices = []
      if (choiceString.length > 0) {
        choiceString.split("\n").map((choice => {
          return { value: choice }
        }))
      }
      let model = this.customCheckoutFields.value
      model["multipleChoices"] = multipleChoices
      this.selectedCustomFields[this.deleteIndex] = model
      $('#customOrderFieldModal').modal('hide')
    }
    else {
      // alert("Fill mandatory fields")
    }
  }

  addField() {
    if (this.customCheckoutFields.status == 'VALID') {
      let choiceString = this.customCheckoutFields.get("multipleChoices").value.trim()
      let multipleChoices = []
      if (choiceString.length > 0) {
        multipleChoices = choiceString.split("\n").map((choice => {
          return { value: choice }
        }))
      }
      let model = this.customCheckoutFields.value
      model["multipleChoices"] = multipleChoices
      this.selectedCustomFields.push(model)
      $('#customOrderFieldModal').modal('hide')
    }
    else {
      alert("Fill mandatory fields")
    }

  }

  submit() {
    let model = []
    this.storeService.updateCustomCheckoutFields(this.selectedCustomFields, this.teamStoreId).subscribe(
      (response) => {
        if (response.status == 1) {
          this.commonService.openSuccessSnackBar(response.message, '');
          const url = this.commonService.createUrl(this.router.url, '/storecommission', 2);
          this.router.navigateByUrl(url);
        } else {
          this.commonService.openErrorSnackBar(response.message, '');
        }

      },
      (error) => {
        console.log(error);
      }
    );
  }

  setCustomCheckoutFieldsValues(field: any) {
    let multipleChoices = ''
    for (let choice of field.multipleChoices) {
      multipleChoices += choice.value + '\n'
      this.multipleChoiceArray.push(choice.value)
    }
    this.customCheckoutFields.setValue({
      customFieldType: field.customFieldType,
      isMandatory: field.isMandatory,
      fieldLabel: field.fieldLabel,
      fieldInstruction: field.fieldInstruction,
      multipleChoices: multipleChoices
    })
  }

  updateMultipleChoiceArray() {
    let string = this.customCheckoutFields.get("multipleChoices").value.trim()
    this.multipleChoiceArray = string.split("\n")
  }

}
