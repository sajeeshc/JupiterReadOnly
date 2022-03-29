import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-margin-calc',
  templateUrl: './margin-calc.component.html',
  styleUrls: ['./margin-calc.component.scss','../common-styles.scss']
})
export class MarginCalcComponent implements OnInit {

  productMarginFormulaArray = []
  marginFormulaForm: FormGroup
  updateMarginFormula = false

  paginatorLength: number
  paginatorPageSize: number = 10
  paginatorPageSizeOptions: number[] = [5, 10, 25, 100]
  paginatorIndex: number = 0

  constructor(private productService: ProductService,
    private formBuilder: FormBuilder,
    private commonService : CommonService) { }

  ngOnInit() {
    this.initializeMarginFormulaForm()
    this.getProductMarginFormulas()
  }

  initializeMarginFormulaForm() {
    this.marginFormulaForm = this.formBuilder.group({
      id: 0,
      calculation: ['', Validators.required]
    })
    this.updateMarginFormula = false
  }

  getProductMarginFormulas() {
    let params = {
      page: (this.paginatorIndex + 1),
      per_page: this.paginatorPageSize,
    }
    this.productService.getAllProductMarginFormulas(params).subscribe(res => {
      this.productMarginFormulaArray = res.body.data
      this.paginatorLength = JSON.parse(res.headers.get("Pagination")).totalItems
    })
  }

  updateProductMarginFormula() {
    if (this.marginFormulaForm.valid) {
      this.productService.updateProductMarginFormula(this.marginFormulaForm.value).subscribe(res => {
        this.initializeMarginFormulaForm();
        this.getProductMarginFormulas();
        this.commonService.openSuccessSnackBar(res.message,'')
      })
    }
    this.updateMarginFormula = false
  }

  editMarginFormula(item){
    this.updateMarginFormula = true;
    this.marginFormulaForm.setValue({
      id : item.id,
      calculation : item.calculation 
    });
  }

  removeMarginFormula(id){
    Swal.fire({
      html: '<h5>Do you want to delete this formula?</h5>',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.removeProductMarginFormula(id).subscribe(res => {
          this.getProductMarginFormulas();
          this.commonService.openSuccessSnackBar(res.message,'')
        })
      }
    })
  }

  pageEvent(event) {
    this.paginatorPageSize = event.pageSize
    this.paginatorIndex = event.pageIndex
    this.getProductMarginFormulas();
  }

}
