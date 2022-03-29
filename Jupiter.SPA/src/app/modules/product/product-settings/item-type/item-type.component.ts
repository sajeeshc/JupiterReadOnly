import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "src/app/core/services/common.service";
import { ProductService } from "src/app/core/services/product.service";

declare var $: any;
const Swal = require("sweetalert2");

@Component({
  selector: "app-item-type",
  templateUrl: "./item-type.component.html",
  styleUrls: ["./item-type.component.scss", "../common-styles.scss"],
})
export class ItemTypeComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private productService: ProductService
  ) {}

  itemTypeArray = [];
  itemTypeForm: FormGroup;
  isUpdate = false;

  paginatorLength: number;
  paginatorPageSize: number = 10;
  paginatorPageSizeOptions: number[] = [5, 10, 25, 100];
  paginatorIndex: number = 0;

  ngOnInit() {
    this.getItemTypes();
    this.initializeForm();
  }

  initializeForm() {
    this.itemTypeForm = this.formBuilder.group({
      id: [0],
      name: ["", Validators.required],
      weight: ["", Validators.required],
      volume: ["", Validators.required],
    });
  }

  getItemTypes() {
    let params = {
      page: this.paginatorIndex + 1,
      per_page: this.paginatorPageSize,
    };
    this.productService.getAllItemTypes(params).subscribe((res) => {
      this.itemTypeArray = res.body.data;
      this.paginatorLength = JSON.parse(
        res.headers.get("Pagination")
      ).totalItems;
    });
  }

  openEditPopup(itemType) {
    this.itemTypeForm = this.formBuilder.group({
      id: [itemType.id],
      name: [itemType.name, Validators.required],
      weight: [itemType.weight, Validators.required],
      volume: [itemType.volume, Validators.required],
    });
    this.isUpdate = true;
    $("#itemTypeModal").modal("show");
  }

  openAddPopup() {
    $("#itemTypeModal").modal("show");
  }

  saveItemType() {
    if (this.itemTypeForm.valid) {
      this.productService
        .saveItemType(this.itemTypeForm.value)
        .subscribe((res) => {
          if (this.isUpdate) {
            this.commonService.openSuccessSnackBar(
              "Item type updated successfully",
              ""
            );
            let i = this.itemTypeArray.findIndex((itemType) => {
              return itemType.id == this.itemTypeForm.value.id;
            });
            this.itemTypeArray.splice(i, 1, this.itemTypeForm.value);
          } else {
            this.commonService.openSuccessSnackBar(
              "Item type added successfully",
              ""
            );
            this.itemTypeForm.get("id").setValue(res.data);
            this.itemTypeArray.unshift(this.itemTypeForm.value);
            this.getItemTypes();
          }
          this.closePopup();
        });
    }
  }

  removeItemType(id, i) {
    Swal.fire({
      html: "<h5>Do you want to delete this item type?</h5>",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteItemType(id).subscribe((res) => {
          this.commonService.openSuccessSnackBar(
            "Item type deleted successfully",
            ""
          );
          this.itemTypeArray.splice(i, 1);
          this.getItemTypes();
        });
      }
    });
  }

  closePopup() {
    this.isUpdate = false;
    this.initializeForm();
    $("#itemTypeModal").modal("hide");
  }

  pageEvent(event) {
    this.paginatorPageSize = event.pageSize;
    this.paginatorIndex = event.pageIndex;
    this.getItemTypes();
  }
}
