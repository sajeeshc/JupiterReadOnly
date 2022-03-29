import { stringify } from '@angular/compiler/src/util';
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatFormField, MatInputModule } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-selection',
  templateUrl: './product-selection.component.html',
  styleUrls: ['./product-selection.component.scss']
})
export class ProductSelectionComponent implements OnInit {

  productCategoryGroup: FormGroup;
  categoryOptions: CategoryModel[] = [];
  productOptions: ProductModel[] = [];
  categoryFilteredOptions: Observable<CategoryModel[]>;
  ProductFilteredOptions: Observable<ProductModel[]>;
  categoryControl = new FormControl();
  productControl = new FormControl();
  selectedObject: any = {};
  teamStoreId : any;

  constructor(public dialogRef: MatDialogRef<ProductSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mapInput: MatInputModule,
    private formBuilder: FormBuilder,
    private productService: ProductService) { }

  ngOnInit () {

    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));

    this.productCategoryGroup = this.formBuilder.group({
      category: new FormControl(''),
      product: new FormControl('')
    });

    this.getProductCategories();
    this.getProducts();

    this.categoryFilteredOptions = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCategory(value))
    );

    this.ProductFilteredOptions = this.productControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProduct(value))
    );
  }

  private _filterCategory (value: string): CategoryModel[] {
    const filterValue = value.toLowerCase();
    return this.categoryOptions.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterProduct (value: string): ProductModel[] {
    const filterValue = value.toLowerCase();
    return this.productOptions.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  getProductCategories () {

    (this.productService.getProductCategory()).subscribe(response => {
      this.categoryOptions = response.body.data;
    });
  }

  getProducts () {
    (this.productService.getProduct({})).subscribe(response => {
      this.productOptions = response.body;
    });
  }

  addToListAction () {
    this.closeDialog();
  }

  closeDialog () {
    this.dialogRef.close(this.selectedObject);
  }

  onSelect (value: string) {
    this.selectedObject.name = value;
    this.productControl.setValue(value);
  }
}



class ProductModel {
  name: string;
  id: number;
}

class CategoryModel {
  name: string;
  id: number;
}
