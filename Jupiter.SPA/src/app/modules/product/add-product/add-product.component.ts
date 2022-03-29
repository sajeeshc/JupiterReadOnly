import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, pairwise, startWith } from "rxjs/operators";
import { CommonService } from "src/app/core/services/common.service";
import { ProductService } from "src/app/core/services/product.service";
import { StoreService } from "src/app/core/services/store.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import Swal from "sweetalert2";

declare var $: any;

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"],
})
export class AddProductComponent implements OnInit, OnDestroy {
  @ViewChild("colorInput", null) colorInput: ElementRef<HTMLInputElement>;
  categoryList: any[] = [];
  colorList: any[] = [];
  sizeList: any[] = [];
  statusList: any[] = [];
  serviceList: any[] = [];
  decoGroupList: any[] = [];
  productList: any[] = [];
  productGroupList: any[] = [];
  itemTypeList = [];
  productForm: FormGroup;
  // selectedProduct: any;
  // imgList: any[] = [];
  uploadedImageFile: any;
  selectedImageFileName: any = "";
  sides = ['Front', 'Back', 'Left', 'Right']
  sizeCharts = []

  colorsSelected = [];
  // colorsSelected = new FormControl([])
  colorControl = new FormControl("");
  filteredColors: Observable<string[]>;
  selectedColorIndex = null;
  sizeVariants = new FormControl([], Validators.required);
  // sizeVariantValue = []
  imageVariantValue = [];
  ignoreSizeValueChange = false;
  ignoreColorValueChange = false;
  isUpdate = false;

  companionAutoText = new FormControl("");
  alternateAutoText = new FormControl("");
  relatedAutoText = new FormControl("");
  filteredCompProd: Observable<any[]>;
  filteredAltProd: Observable<any[]>;
  filteredRelProd: Observable<any[]>;

  constructor(
    private productService: ProductService,
    private storeService: StoreService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filteredCompProd = this.companionAutoText.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterComp(value))
    );
    this.filteredAltProd = this.alternateAutoText.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterAlt(value))
    );
    this.filteredRelProd = this.relatedAutoText.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterRel(value))
    );
    this.filteredColors = this.colorControl.valueChanges.pipe(
      startWith(""),
      map((color) => this._filterColor(color))
    );
  }

  ngOnDestroy(): void {
    $(".modal").modal("hide");
    $("body").removeClass("modal-open");
    $(".modal-backdrop").remove();
  }

  ngOnInit() {
    let productId = this.route.snapshot.paramMap.get("productId");
    if (productId) {
      this.getProduct(productId);
      this.isUpdate = true;
    }
    if (this.isUpdate) this.commonService.setPageHeader("Update Product");
    else this.commonService.setPageHeader("Add Product");
    this.createProductFormGroup();
    this.getProductCategories();
    this.getDecoGroups();
    this.getProductGroups();
    this.getProductStatuses();
    this.getProductList();
    this.getProductColors();
    this.getProductSizes();
    this.getItemTypes();
    // this.colorsSelected.valueChanges
    //   .pipe(startWith(null), pairwise())
    //   .subscribe(([prev, next]: [any, any]) => {
    //     if (this.ignoreColorValueChange) return
    //     let add = false
    //     let colorId
    //     if (!prev) {
    //       add = true
    //       colorId = next[0]
    //     } else if (!next) {
    //       add = false
    //       colorId = prev[0]
    //     } else {
    //       add = prev.length < next.length
    //     }
    //     if (colorId) {
    //       if (add) this.createVariant(this.getColorById(colorId))
    //       else this.removeVariant(this.getColorById(colorId))
    //       return
    //     }

    //     if (add) {
    //       for (let i = 0; i < next.length; i++) {
    //         if (!prev.includes(next[i])) {
    //           colorId = next[i]
    //           break
    //         }
    //       }
    //       this.createVariant(this.getColorById(colorId))
    //     } else {
    //       for (let i = 0; i < prev.length; i++) {
    //         if (!next.includes(prev[i])) {
    //           colorId = prev[i]
    //           break
    //         }
    //       }
    //       this.removeVariant(this.getColorById(colorId))
    //     }
    //   });

    this.sizeVariants.valueChanges
      .pipe(startWith(null), pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        if (this.ignoreSizeValueChange) return;
        let add = false;
        let sizeId;
        if (!prev) {
          add = true;
          sizeId = next[0];
        } else if (!next) {
          add = false;
          sizeId = prev[0];
        } else {
          add = prev.length < next.length;
        }

        if (sizeId) {
          if (add) this.createSizeVariant(sizeId);
          else this.removeSizeVariant(sizeId);
          return;
        }

        if (add) {
          for (let i = 0; i < next.length; i++) {
            if (!prev.includes(next[i])) {
              sizeId = next[i];
              break;
            }
          }
          this.createSizeVariant(sizeId);
        } else {
          for (let i = 0; i < prev.length; i++) {
            if (!next.includes(prev[i])) {
              sizeId = prev[i];
              break;
            }
          }
          this.removeSizeVariant(sizeId);
        }
      });
  }

  getProduct(productId) {
    this.productService.getProductDetailsById(productId, false).subscribe(
      (response) => {
        this.createProductFormGroup(response.data);
      },
      (error) => {
        // this.commonService.openErrorSnackBar(error.message, "");
      }
    );
  }

  getColorById(id) {
    return this.colorList.find((el) => el.id == id);
  }

  getColorByName(name) {
    return this.colorList.find(
      (el) => el.name.toLowerCase() == name.toLowerCase()
    );
  }

  createProductFormGroup(product?) {
    if (!product) product = product || {};
    let active = product.id ? product.active : true
    this.productForm = this.fb.group({
      categories: new FormControl(product.categories || []),
      groups: new FormControl(product.groups || []),
      images: new FormControl([]),
      id: product.id || 0,
      name: [product.name || "", Validators.required],
      displayName: [product.displayName || ""],
      description: new FormControl(product.description || ""),
      active: new FormControl(active),
      colors: this.fb.array([]),
      storeStatus: new FormControl(
        product.storeStatus || "",
        Validators.required
      ),
      decoGroupId: new FormControl(product.decoGroupId || ""),
      relatedProducts: new FormControl(product.relatedProducts || []),
      requiredComponents: new FormControl(product.requiredComponents || []),
      alternateProducts: new FormControl(product.alternateProducts || []),
      sizes: new FormControl([]),
      itemTypeId: new FormControl(product.itemTypeId || ""),
      metaData: new FormControl(product.metaData || ""),
      adCopy: new FormControl(product.adCopy || ""),
      variants: this.fb.array([], Validators.required),
      vendorName: new FormControl(product.vendorName || ""),
      styleName: new FormControl(product.styleName || ""),
      sizeCharts: this.fb.control([])
    });
    if (product.id) {
      let tempColorsArr = [];
      product.variants.forEach((variant) => {
        this.createVariant(variant);
        tempColorsArr.push(variant.id);
      });
      this.ignoreColorValueChange = true;
      // this.colorsSelected.setValue(tempColorsArr)
      this.colorsSelected = tempColorsArr;
      this.ignoreColorValueChange = false;
    }
    this.sizeCharts = product.sizeCharts || []
  }

  createVariant(variant) {
    let variantArr = this.productForm.get("variants") as FormArray;
    let sizeVariants = this.fb.array([], Validators.required);
    if (variant.sizeVariants && variant.sizeVariants.length > 0) {
      variant.sizeVariants.forEach((size) => {
        sizeVariants.push(
          this.fb.group({
            sizeId: size.sizeId,
            size: size.size,
            originalPrice: size.originalPrice,
            sellingPrice: size.sellingPrice,
            storePrice: size.storePrice,
            sortOrder: size.sortOrder,
          })
        );
      });
    }
    if (!variant.images || !variant.images.length)
      variant.images = this.getImagePlaceholderArray()
    let variantGrp = this.fb.group({
      id: variant.id,
      name: variant.name,
      hexValue: variant.hexValue,
      images: this.fb.control(
        variant.images
      ),
      sizeVariants,
      swatch: variant.swatch || "",
    });
    variantArr.push(variantGrp);
  }

  getImagePlaceholderArray() {
    let obj = {
      id: 0,
      src: "",
      thumbnail: "",
      sortOrder: 1,
    };
    let arr = [];
    arr.push(JSON.parse(JSON.stringify(obj)));
    obj.sortOrder = 2
    arr.push(JSON.parse(JSON.stringify(obj)));
    obj.sortOrder = 3
    arr.push(JSON.parse(JSON.stringify(obj)));
    obj.sortOrder = 4
    arr.push(JSON.parse(JSON.stringify(obj)));
    return arr;
  }

  removeVariant(id) {
    let variantArr = this.productForm.get("variants") as FormArray;
    let index = variantArr.value.findIndex((el) => el.id == id);
    variantArr.removeAt(index);
  }

  removeSizeVariant(id) {
    let arr = this.productForm
      .get("variants")
    ["controls"][this.selectedColorIndex].get("sizeVariants") as FormArray;
    let index = arr.value.findIndex((el) => el.sizeId == id);
    arr.removeAt(index);
  }

  createSizeVariant(id) {
    if (!id) return;
    let arr = this.productForm
      .get("variants")
    ["controls"][this.selectedColorIndex].get("sizeVariants") as FormArray;
    let index = 0;
    let size = this.getSizeById(id);
    for (let ctrl of arr.value) {
      if (ctrl.sortOrder < size.sortOrder) index++;
    }
    arr.insert(
      index,
      this.fb.group({
        sizeId: size.id,
        size: size.name,
        originalPrice: 0,
        sellingPrice: 0,
        storePrice: 0,
        sortOrder: size.sortOrder,
      })
    );
  }

  setColorGroupIndex() {
    let variants = this.productForm.get("variants").value;
    if (variants.length) {
      this.selectedColorIndex = 0;
      this.updateImageAndSize();
    }
  }

  updateImageAndSize() {
    this.ignoreSizeValueChange = true;
    let arr = this.productForm.get("variants").value;
    let sizeVariantValue = [];
    this.sizeVariants.setValue([]);
    if (
      arr[this.selectedColorIndex].sizeVariants &&
      arr[this.selectedColorIndex].sizeVariants.length
    ) {
      sizeVariantValue = arr[this.selectedColorIndex].sizeVariants.map((el) => {
        return el.sizeId;
      });
      this.sizeVariants.setValue(sizeVariantValue);
    }
    this.ignoreSizeValueChange = false;
  }

  getSizeVariants() {
    let arr = this.productForm
      .get("variants")
    ["controls"][this.selectedColorIndex].get("sizeVariants")["controls"];
    return arr;
  }

  getProductColors() {
    this.storeService.getAvailableStoreColors().subscribe((response) => {
      this.colorList = response.data;
      this.resetColorControl();
    });
  }

  getSizeById(id) {
    return this.sizeList.find((el) => el.id == id);
  }

  getProductSizes() {
    this.productService.getAllAvailableSizes().subscribe((response) => {
      this.sizeList = response.sizes;
    });
  }

  getDecoGroups() {
    this.productService.getAllDecoGroups({ per_page: 0 }).subscribe(
      (response) => {
        this.decoGroupList = response.body.data;
      },
      (error) => { }
    );
  }

  getProductCategories() {
    this.productService.getProductCategory().subscribe(
      (response) => {
        this.categoryList = response.body.data;
      },
      (error) => { }
    );
  }

  getProductStatuses() {
    this.productService.getAllProductStatuses({}).subscribe(
      (response) => {
        this.statusList = response.body.data;
      },
      (error) => { }
    );
  }

  getProductGroups() {
    this.productService.getAllProductGroups({}).subscribe(
      (response) => {
        this.productGroupList = response.body.data;
      },
      (error) => { }
    );
  }

  getItemTypes() {
    this.productService.getAllItemTypes({}).subscribe(
      (response) => {
        this.itemTypeList = response.body.data;
      },
      (error) => { }
    );
  }

  getProductList() {
    this.productService.getProducts({ per_page: 0, feed: false }).subscribe(
      (response) => {
        this.productList = response.body.data;
        this.companionAutoText.setValue("");
        this.alternateAutoText.setValue("");
        this.relatedAutoText.setValue("");
      },
      (error) => { }
    );
  }

  attributeDisplay(attribute1, attribute2) {
    if (attribute1 && attribute2) {
      if (attribute1.id == attribute2.id) {
        return attribute1.name;
      }
    }
    return "";
  }

  // displayFn(opt): string {
  //   return opt && opt.name ? opt.name : '';
  // }

  removeDecoLocations(i) {
    let cpControl = this.productForm.get("locations");
    let value = cpControl.value;
    value.splice(i, 1);
    cpControl.setValue(value);
  }

  removeCompanionProducts(i) {
    let cpControl = this.productForm.get("requiredComponents");
    let value = cpControl.value;
    value.splice(i, 1);
    cpControl.setValue(value);
  }

  removeRelatedProducts(i) {
    let rpControl = this.productForm.get("relatedProducts");
    let value = rpControl.value;
    value.splice(i, 1);
    rpControl.setValue(value);
  }

  removeAlternateProducts(i) {
    let apControl = this.productForm.get("alternateProducts");
    let value = apControl.value;
    value.splice(i, 1);
    apControl.setValue(value);
  }

  selectImageFile(event, n?) {
    let selectedFiles = event.target.files;
    this.uploadedImageFile = selectedFiles.item(0);
    this.selectedImageFileName = this.uploadedImageFile.name;
    event.target.value = "";
    this.uploadImg(n);
  }

  selectSwatchFile(event) {
    let selectedFiles = event.target.files;
    this.uploadedImageFile = selectedFiles.item(0);
    this.selectedImageFileName = this.uploadedImageFile.name;
    event.target.value = "";
    this.uploadSwatch();
  }

  uploadImg(n?) {
    let formData = new FormData();
    formData.append("file", this.uploadedImageFile);

    this.productService.uploadImgFile(formData).subscribe((res) => {
      if (res) {
        let src = res.data;
        // this.imgList.push(url);
        this.productForm
          .get("variants")
        ["controls"][this.selectedColorIndex].get("images").value[n].src =
          src;
        this.productForm
          .get("variants")
        ["controls"][this.selectedColorIndex].get("images").value[
          n
        ].thumbnail = src;
        $("#productImg").attr("src", src);
      }
    });
  }

  uploadSwatch() {
    let formData = new FormData();
    formData.append("file", this.uploadedImageFile);

    this.productService.uploadImgFile(formData).subscribe((res) => {
      if (res) {
        let src = res.data;
        // this.imgList.push(url);
        this.productForm
          .get("variants")
        ["controls"][this.selectedColorIndex].get("swatch")
          .setValue(src);
        // $('#productImg').attr("src", src);
      }
    });
  }

  onImgClick(src, index = 0) {
    $(".img-holder").attr("src", src);
    let arr = $(".drop-list .img-wraps");
    if (!arr || !arr.length) return;
    for (let i = 0; i < arr.length; i++) {
      arr[i].classList.remove("selected");
    }
    arr[index].classList.add("selected");
  }

  submitProduct() {
    if (this.productForm.valid) {
      this.productForm.get('sizeCharts').setValue(this.sizeCharts)
      if (this.isUpdate) {
        this.productService
          .updateProductData(this.productForm.value)
          .subscribe((res) => {
            this.commonService.openSuccessSnackBar(
              "Product updated successfully",
              ""
            );
            this.router.navigateByUrl("/productmanager/dashboard");
          });
      } else {
        this.productService
          .addNewProductData(this.productForm.value)
          .subscribe((res) => {
            this.commonService.openSuccessSnackBar(
              "New product added successfully",
              ""
            );
            this.router.navigateByUrl("/productmanager/dashboard");
          });
      }
    } else {
      if (this.productForm.get("name").invalid)
        this.commonService.openErrorSnackBar(
          "Please enter product name to continue",
          ""
        );
      else if (this.productForm.get("variants").invalid)
        this.commonService.openErrorSnackBar(
          "Please select color variants and sizes to continue",
          ""
        );
      else if (this.productForm.get("storeStatus").invalid)
        this.commonService.openErrorSnackBar(
          "Please select store status to continue",
          ""
        );
      else if (this.productForm.get("decoGroupId").invalid)
        this.commonService.openErrorSnackBar(
          "Please select deco group to continue",
          ""
        );
    }
  }

  deleteImg(img, n?) {
    Swal.fire({
      html: "<h5>Do you want to delete this image?</h5>",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        this.productForm
          .get("variants")
        ["controls"][this.selectedColorIndex].get("images").value[n].src = "";
        this.productForm
          .get("variants")
        ["controls"][this.selectedColorIndex].get("images").value[
          n
        ].thumbnail = "";
        // setValue(
        //   this.productForm
        //     .get("variants")
        //     ["controls"][this.selectedColorIndex].value.images.filter(
        //       (el) => {
        //         return el.src != img.src;
        //       }
        //     )
        // );
        this.setLastImage();
        this.commonService.openSuccessSnackBar(
          "Image deleted successfully",
          ""
        );
      }
    });
  }

  deleteSwatch() {
    this.productForm
      .get("variants")
    ["controls"][this.selectedColorIndex].get("swatch")
      .setValue("");
  }

  setLastImage() {
    let img =
      this.productForm.get("variants")["controls"][this.selectedColorIndex]
        .value.images[0];
    if (img) this.onImgClick(img.src, 0);
    else this.onImgClick("");
  }

  get itemType() {
    return this.itemTypeList.find((type) => {
      return type.id == this.productForm.value.itemTypeId;
    });
  }

  get decoGroup() {
    return this.decoGroupList.find((grp) => {
      return grp.id == this.productForm.value.decoGroupId;
    });
  }

  companionProductSelected(event) {
    const prod = event.option.value;
    this.productForm.get("requiredComponents").value.push(prod);
    this.companionAutoText.setValue("");
  }

  alternateProductSelected(event) {
    const prod = event.option.value;
    this.productForm.get("alternateProducts").value.push(prod);
    this.alternateAutoText.setValue("");
  }

  relatedProductSelected(event) {
    const prod = event.option.value;
    this.productForm.get("relatedProducts").value.push(prod);
    this.relatedAutoText.setValue("");
  }

  private _filterComp(value: string): string[] {
    const filterValue = value ? value.toString().toLowerCase() : "";

    return this.productList.filter((option) => {
      if (!option.name) return false;
      return (
        option.name.toLowerCase().includes(filterValue) &&
        this.productForm.get("requiredComponents").value.includes(option) ==
        false
      );
    });
  }

  private _filterAlt(value: string): string[] {
    const filterValue = value ? value.toString().toLowerCase() : "";

    return this.productList.filter((option) => {
      if (!option.name) return false;
      return (
        option.name.toLowerCase().includes(filterValue) &&
        this.productForm.get("alternateProducts").value.includes(option) ==
        false
      );
    });
  }

  private _filterRel(value: string): string[] {
    const filterValue = value ? value.toString().toLowerCase() : "";

    return this.productList.filter((option) => {
      if (!option.name) return false;
      return (
        option.name.toLowerCase().includes(filterValue) &&
        this.productForm.get("relatedProducts").value.includes(option) == false
      );
    });
  }

  private _filterColor(value: string): string[] {
    const filterValue = value ? value.toString().toLowerCase() : "";

    return this.colorList.filter((option) => {
      // if (!option.name)
      //   return false
      return (
        option.name.toLowerCase().includes(filterValue) &&
        this.productForm
          .get("variants")
          .value.findIndex((el) => el.id == option.id) == -1
      );
    });
  }

  colorSelected(event) {
    this.createVariant(event.option.value);
    this.resetColorControl();
  }

  addColor(colorNames) {
    let invalidColorFound = false;
    colorNames.split(",").forEach((colorName) => {
      let color = this.getColorByName(colorName);
      if (color) this.createVariant(color);
      else invalidColorFound = true;
    });
    this.resetColorControl();
    if (invalidColorFound)
      this.commonService.openErrorSnackBar(
        "One or more colors were invalid",
        ""
      );
  }

  resetColorControl() {
    this.colorControl.setValue("");
    this.colorInput.nativeElement.value = "";
  }

  setStorePrice(size: FormGroup) {
    let price = size.get("sellingPrice").value;
    price = Math.ceil(price);
    if (price > 20) price = price + 2;
    else price = price + 1;
    size.get("storePrice").setValue(price);
  }

  copySizeToAll() {
    this.ignoreSizeValueChange = true;
    let baseSizes = this.productForm
      .get("variants")
    ["controls"][0].get("sizeVariants").value;
    let variants = this.productForm.get("variants")["controls"];
    for (let i = 1; i < variants.length; i++) {
      let arr = variants[i].get("sizeVariants");
      arr.clear();
      baseSizes.forEach((size) => {
        arr.push(
          this.fb.group({
            sizeId: size.sizeId,
            size: size.size,
            originalPrice: size.originalPrice,
            sellingPrice: size.sellingPrice,
            storePrice: size.storePrice,
            sortOrder: size.sortOrder,
          })
        );
      });
    }
    this.ignoreSizeValueChange = false;
    this.commonService.openSuccessSnackBar(
      "Sizes and price copied to all variants",
      ""
    );
    // variants.forEach(variant => {
    //   variant.get('sizeVariants').setValue(baseSizes)
    // });
  }

  copySizeFromPrevious() {
    this.ignoreSizeValueChange = true;
    let baseSizes = this.productForm
      .get("variants")
    ["controls"][this.selectedColorIndex - 1].get("sizeVariants").value;
    let variant =
      this.productForm.get("variants")["controls"][this.selectedColorIndex];
    let arr = variant.get("sizeVariants") as FormArray;
    arr.clear();
    // arr.setValue(this.fb.array([]))
    baseSizes.forEach((size) => {
      arr.push(
        this.fb.group({
          sizeId: size.sizeId,
          size: size.size,
          originalPrice: size.originalPrice,
          sellingPrice: size.sellingPrice,
          storePrice: size.storePrice,
          sortOrder: size.sortOrder,
        })
      );
    });
    this.ignoreSizeValueChange = false;
    this.updateImageAndSize();
    this.commonService.openSuccessSnackBar(
      "Sizes and price copied from previous variant",
      ""
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.productForm.value.variants[this.selectedColorIndex].images,
      event.previousIndex,
      event.currentIndex
    );
  }

  uploadSizeChart(files) {
    const formData = new FormData();
    formData.append("file", files.item(0));
    if (files.item(0).name.split(".").pop().toLowerCase() == "pdf") {
      this.commonService.toggleLoading(true)
      this.storeService.uploadPdfArt(formData).subscribe((response) => {
        this.commonService.toggleLoading(false)
        response.data.imageFileUrls.forEach((url) => {
          this.sizeCharts.push({url});
        });
      }, err => {
        this.commonService.toggleLoading(false)
      });
    } else if(['jpg','png','jpeg','gif','webp','jfif'].includes(files.item(0).name.split(".").pop().toLowerCase())){
      this.commonService.toggleLoading(true)
      this.storeService.uploadArt(formData).subscribe((response) => {
        this.commonService.toggleLoading(false)
        this.sizeCharts.push({url:response.data});
      }, err => {
        this.commonService.toggleLoading(false)
      });
    }else{
      this.commonService.openErrorSnackBar("Invalid file format","")
    }
  }
}
