import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";
import { ProductService } from "src/app/core/services/product.service";
import { SharedService } from "src/app/core/services/shared.service";
import { StoreService } from "src/app/core/services/store.service";
import Swal from "sweetalert2";

declare var $: any;
@Component({
  selector: "app-product-view",
  templateUrl: "./product-view.component.html",
  styleUrls: ["./product-view.component.scss"],
})
export class ProductViewComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private sharedServices: SharedService,
  ) { }

  decoGroup
  teamStoreId: any;
  purchaseType: any;
  productId: any;
  mapCode: any;
  cartId: any;
  isEdit: boolean = false;
  designId: any;
  product: any;
  quantityGroup: FormGroup;
  cartItemGrids: FormArray;
  personalizeValue: boolean = false;
  noImagePlaceholder = "../../../../assets/images/no-image.jpg";
  serviceArray: any[] = [];
  selectedColor: any = "";
  selectedServiceId = 1;
  loading = true;
  personalizationTypes = []
  personalizationServices = []
  inkColorArray
  personalizationPropertiesForm: FormArray
  decorationPropertiesForm: FormArray = new FormArray([])
  decoPrice
  decoPriceLoading = false
  // namePersonalizationQuantity
  // numberPersonalizationQuantity
  ngOnInit() {
    this.purchaseType = parseInt(localStorage.getItem("purchaseType"));
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.teamStoreId = this.teamStoreId ? this.teamStoreId : null;
    this.productId = this.route.snapshot.paramMap.get("productId");
    this.mapCode = this.route.snapshot.paramMap.get("mapCode");
    this.getPersonalizationServices()
    this.getPersonalizationTypes()
    this.getAvailableInkColors()
    this.createPersonalizationPropertiesForm()
    if (this.productId && this.productId.split("-")[1])
      this.selectedColor = this.productId.split("-")[1];
    this.createQuantityForm(0);

    if (this.purchaseType == 2) {
      // RegularPurchaseWithDesign - 2
      this.designId = this.route.snapshot.paramMap.get("productId");
      this.cartId = this.route.snapshot.paramMap.get("cartId");
      if (!this.designId || !this.cartId) {
        let count = 0;
        let thisObj = ({} = this);
        window.parent.postMessage("loaded", "*");
        window.addEventListener(
          "message",
          function (e) {
            if (count == 0) {
              thisObj.designId = new String(e.data.productId).toString();

              if (!thisObj.designId) {
                thisObj.route.paramMap.subscribe((params) => {
                  thisObj.designId = params.get("productId");
                  thisObj.cartId = params.get("cartId");
                });
              }
              if (thisObj.cartId != null) {
                thisObj.isEdit = true;
                thisObj.getCartDetails();
              }
              thisObj.getDirectProductDetail(thisObj.designId, 1);
              thisObj.productId = localStorage.getItem("productId");
              thisObj.createQuantityForm(thisObj.designId);
              count++;
            }
          },
          false
        );
      } else {
        // direct purcahse
        if (this.cartId != null) {
          this.isEdit = true;
          this.getCartDetails();
        }
        this.getDirectProductDetail(this.designId, 1);
        this.productId = localStorage.getItem("productId");
        this.createQuantityForm(this.designId);
      }
    } else {
      this.route.paramMap.subscribe((params) => {
        this.productId = params.get("productId");
        this.cartId = params.get("cartId");
      });
      if (this.cartId != null) {
        this.isEdit = true;
        this.getCartDetails();
      }
      if (this.purchaseType == 1) {
        // RegularPurchaseWithoutDesign -1
        this.getDirectProductDetail(this.productId, 2);
      } else {
        // PurchaseWithTeamstore - 3
        if (!this.productId) this.productId = localStorage.getItem("productId");
        if (!this.mapCode) this.mapCode = localStorage.getItem("mapCode");
        this.getTeamstoreProductDesignedDetails();
      }
    }
    this.getAvailableStoreServices();
  }

  createPersonalizationPropertiesForm() {
    this.personalizationPropertiesForm = this.formBuilder.array([])
    this.personalizationTypes.forEach(type => {
      this.personalizationPropertiesForm.push(this.createPersonalizationPropertiesGroup(type))
    })
  }

  createPersonalizationPropertiesGroup(type) {
    return this.formBuilder.group({
      personalizationTypeId: type.id,
      name: type.type,
      positionId: ['', Validators.required],
      serviceId: ['', Validators.required],
      sizeId: ['', Validators.required],
      colorId: ['', Validators.required],
      fontId: ['', Validators.required],
    })
  }

  createExistingPersonalizationPropertiesGroup(type) {
    return this.formBuilder.group({
      personalizationTypeId: type.personalizationTypeId,
      name: this.personalizationTypes.find(obj => obj.id == type.personalizationTypeId).type,
      positionId: (type.positionId || ''),
      serviceId: (type.serviceId || ''),
      sizeId: (type.sizeId || ''),
      colorId: (type.colorId || ''),
      fontId: (type.fontId || ''),
    })
  }

  setPersonalizationPropertiesForm(arr) {
    this.personalizationPropertiesForm = this.formBuilder.array([])
    if (arr.length == 1)
      arr.push({ personalizationTypeId: arr[0].personalizationTypeId == 1 ? 2 : 1 })
    arr.forEach(type => {
      this.personalizationPropertiesForm.push(this.createExistingPersonalizationPropertiesGroup(type))
    })
  }

  setDecorationPropertiesForm(arr) {
    this.decorationPropertiesForm = this.formBuilder.array([])
    arr.forEach(obj => {
      this.decorationPropertiesForm.push(this.createDecorationPropertyGroup(obj))
    })
  }

  createQuantityForm(designId) {
    this.quantityGroup = this.formBuilder.group({
      cartId: 0,
      teamStoreId: this.teamStoreId,
      productId: this.productId,
      isPersonalize: false,
      quantity: [0, Validators.min(1)],
      totalPrice: 0,
      personalizationPrice: 0,
      personalizedQuantity: 0,
      purchaseType: this.purchaseType,
      // designerCartId: 5072,
      designerCartId: designId,
      cartItemGrids: this.formBuilder.array([this.createItemGrids()]),
      serviceId: 0,
      mapCode: this.mapCode || null,
      price: 0,
      decoPrice: 0,
      namePersonalizationQuantity: 0,
      numberPersonalizationQuantity: 0,
    });
  }

  createItemGrids(): FormGroup {
    let carItemGrid = this.formBuilder.group({
      colorId: new FormControl(this.selectedColor),
      name: new FormControl({ value: "", disabled: true }),
      number: new FormControl({ value: "", disabled: true }),
      size: new FormControl("", Validators.required),
      quantity: new FormControl("", Validators.required),
      personalize: new FormControl(false),
      totalPrice: 0,
      // personalizationPrice: 0,
      personalizationType: 0,
      personalizationNamePrice: 0,
      personalizationNumberPrice: 0,
      decoPrice: 0,
    });
    return carItemGrid;
  }

  updateItemGrid(gridItem) {
    const disabled = !gridItem.personalize;
    let carItemGrid = this.formBuilder.group({
      colorId: gridItem.colorId,
      name: [{ value: gridItem.name, disabled }],
      number: [{ value: gridItem.number, disabled }],
      size: gridItem.sizeId,
      quantity: gridItem.quantity,
      personalize: gridItem.personalize || false,
      totalPrice: gridItem.totalPrice || 0,
      // personalizationPrice: gridItem.personalizationPrice || 0,
      personalizationType: gridItem.personalizationType || 0,
      personalizationNamePrice: gridItem.personalizationNamePrice || 0,
      personalizationNumberPrice: gridItem.personalizationNumberPrice || 0,
      decoPrice: gridItem.decoPrice || 0,
    });
    return carItemGrid;
  }

  addRow() {
    this.cartItemGrids = this.quantityGroup.controls.cartItemGrids as FormArray;
    this.cartItemGrids.push(this.createItemGrids());
  }

  deleteRow(index) {
    this.cartItemGrids = this.quantityGroup.controls.cartItemGrids as FormArray;
    if (this.cartItemGrids.length > 1) this.cartItemGrids.removeAt(index);
    this.getTotalQuantity();
  }

  getTeamstoreProductDesignedDetails() {
    this.storeService
      .getProductDetails(this.teamStoreId, this.productId, this.mapCode)
      .subscribe(
        (response) => {
          this.product = response.data;
          this.loading = false;
          if (this.selectedColor == 0)
            this.selectedColor = this.product.productInfo.variants[0].id;
          this.personalizeValue = this.product.productInfo.isPersonalize;
          this.quantityGroup.patchValue({
            isPersonalize: this.product.productInfo.isPersonalize,
            designerCartId: this.product.designerCartId,
          });
          this.getTotalQuantity();
          this.getDecoGroup()
        },
        (error) => {
          // this.commonService.openErrorSnackBar(error.message, "");
        }
      );
  }

  getAvailableStoreServices() {
    this.storeService.getAvailableStoreServices().subscribe(
      (response) => {
        this.serviceArray = response.data;
      }
    );
  }

  getDirectProductDetail(productId, typeId) {
    this.storeService.getDirectProductDetail(productId, typeId).subscribe(
      // this.storeService.getDirectProductDetail(5072, typeId).subscribe(
      (response) => {
        this.personalizeValue = true;
        this.product = response.data;
        this.loading = false;
        localStorage.setItem("productId", this.product.productInfo.id);
        if (this.selectedColor == 0)
          this.selectedColor = this.product.productInfo.variants[0].id;
        this.quantityGroup.patchValue({
          isPersonalize: this.product.productInfo.isPersonalize,
        });
        if (!this.isEdit && this.purchaseType == 2)
          this.createDecorationProperties(this.product.designedOutput.sides)
        this.getTotalQuantity();
        this.getDecoGroup()
      },
      (error) => {
        // this.commonService.openErrorSnackBar(error.message, "");
      }
    );
  }

  getCartDetails() {
    this.storeService.getCartDetails(this.cartId).subscribe(
      (response) => {
        this.cartItemGrids = this.quantityGroup.controls
          .cartItemGrids as FormArray;
        let itemGrid = response.data.cartItemGrids;
        // if (itemGrid[0].name != "" || itemGrid[0].number != "") {
        //   this.personalizeValue = true;
        // }
        this.selectedColor = itemGrid[0].colorId;
        for (let i = 0; i < itemGrid.length; i++) {
          this.cartItemGrids.push(this.updateItemGrid(itemGrid[i]));
        }

        this.quantityGroup.patchValue({
          cartId: response.data.cartId,
        });
        if (response.data.personalizationProperties && response.data.personalizationProperties.length)
          this.setPersonalizationPropertiesForm(response.data.personalizationProperties)
        this.setDecorationPropertiesForm(response.data.decorationProperties)
        this.deleteRow(0);
        this.getTotalQuantity();
      },
      (error) => {
        this.isEdit = false;
      }
    );
  }

  addToCart() {
    if (this.purchaseType == 2 && this.decorationPropertiesForm.valid == false) {
      Swal.fire({
        position: 'top',
        icon: 'warning',
        text: 'Please complete decoration settings to continue'
      })
      return
    }
    let { isPersonalizationValid, isPersonalized } = this.isPersonalized()


    this.getTotalQuantity();
    if (this.productId && this.productId.split("-")[1])
      this.quantityGroup
        .get("productId")
        .setValue(this.productId.split("-")[0]);
    this.cartItemGrids = this.quantityGroup.controls.cartItemGrids as FormArray;
    for (var i = 0; i < this.cartItemGrids.controls.length; i++) {
      this.cartItemGrids.controls[i].value.colorId = this.selectedColor;
    }
    this.quantityGroup.value.serviceId = this.selectedServiceId;
    // let isPersonalized = false;
    // let isPersonalizationValid = true;
    // this.quantityGroup.get("cartItemGrids")["controls"].forEach((element) => {
    //   if (element.value.personalize) {
    //     isPersonalized = true;
    //     if (
    //       !element.value.name.trim() &&
    //       (element.value.number == null ||
    //         !element.value.number.toString().trim())
    //     ) {
    //       isPersonalizationValid = false;
    //     }
    //   }
    // });
    this.quantityGroup.value.isPersonalize = isPersonalized;
    if (this.quantityGroup.valid) {
      let payload = this.quantityGroup.value
      let isConfirm = false;
      let userId = localStorage.getItem("userId");
      if (!userId) {
        window.parent.postMessage("invalid user", "*");
        return;
      }
      if (this.purchaseType == 2) {
        payload['decorationProperties'] = this.decorationPropertiesForm.value
      }
      if (isPersonalized) {
        if (isPersonalizationValid) {
          let { namePersonalizationQuantity, numberPersonalizationQuantity } = this.quantityGroup.value
          let isNamePersonalizationPropertiesValid = false
          let isNumberPersonalizationPropertiesValid = false
          this.personalizationPropertiesForm.controls.forEach(control => {
            if (control.value.personalizationTypeId == 1 && control.valid)
              isNamePersonalizationPropertiesValid = true
            else if (control.value.personalizationTypeId == 2 && control.valid)
              isNumberPersonalizationPropertiesValid = true
          })
          if (this.purchaseType != 3 &&
            ((namePersonalizationQuantity && !isNamePersonalizationPropertiesValid) ||
              (numberPersonalizationQuantity && !isNumberPersonalizationPropertiesValid))) {
            Swal.fire({
              position: 'top',
              icon: 'warning',
              text: 'Please complete personalization settings to continue'
            })
            return
          }
          let result = Swal.fire({
            text: "Customer is responsible for the spelling of Personalization Text provided. Please review and confirm the names & numbers.",
            icon: "info",
            showCancelButton: true,
            cancelButtonText: "Go back and Verify",
            confirmButtonText: "Confirm and Continue",
            reverseButtons: true,
            position: "top",
          }).then((result) => {
            if (result.isConfirmed) {
              if (this.purchaseType != 3)
                payload['personalizationProperties'] = this.personalizationPropertiesForm.value
              this.storeService.addToCart(payload).subscribe(
                (response) => {
                  this.product = response.data;
                  this.commonService.openSuccessSnackBar(response.message, "");
                  if (this.teamStoreId == null || this.teamStoreId == 0) {
                    this.router.navigateByUrl("enduser/cart");
                  } else {
                    this.router.navigateByUrl("enduser/buyfromlivestore/cart");
                  }
                },
                (error) => {
                  // this.commonService.openErrorSnackBar(error.message, "");
                }
              );
            }
          });
          // isConfirm = result.isConfirmed
        } else {
          this.commonService.openErrorSnackBar(
            "Enter personalization values for selected items",
            ""
          );
        }
      } else {
        // isConfirm = true
        payload['personalizationProperties'] = null
        this.storeService.addToCart(payload).subscribe(
          (response) => {
            this.product = response.data;
            this.commonService.openSuccessSnackBar(response.message, "");
            if (this.teamStoreId == null || this.teamStoreId == 0) {
              this.router.navigateByUrl("enduser/cart");
            } else {
              this.router.navigateByUrl("enduser/buyfromlivestore/cart");
            }
          },
          (error) => {
            // this.commonService.openErrorSnackBar(error.message, "");
          }
        );
      }
      // if (isConfirm) {
      //   this.storeService.addToCart(this.quantityGroup.value).subscribe(response => {
      //     this.product = response.data;
      //     this.commonService.openSuccessSnackBar(response.message, "");
      //     if (this.teamStoreId == null || this.teamStoreId == 0) {
      //       this.router.navigateByUrl('enduser/cart');
      //     } else {
      //       this.router.navigateByUrl('enduser/buyfromlivestore/cart');
      //     }
      //   },
      //     error => {
      //       // this.commonService.openErrorSnackBar(error.message, "");
      //     });
      // }
    } else {
      this.commonService.openErrorSnackBar(
        "Please fill all required fields",
        ""
      );
    }
  }

  backToStore() {
    if (this.purchaseType === 1 || this.purchaseType === 2) {
      this.router.navigateByUrl("enduser/directpurchase/productlist");
    } else {
      this.router.navigateByUrl(
        "enduser/buyfromlivestore/store/" + this.teamStoreId
      );
    }
  }

  // personalize(value) {
  //   this.cartItemGrids = this.quantityGroup.controls.cartItemGrids as FormArray;
  //   this.quantityGroup.patchValue({
  //     isPersonalize: value,
  //   });
  //   for (let i = 0; i <= this.cartItemGrids.length; i++) {
  //     this.cartItemGrids.controls[i].patchValue({
  //       name: null,
  //       number: null,
  //     });
  //   }
  // }

  // clearFormArray = (formArray: FormArray) => {
  //   while (formArray.length !== 0) {
  //     formArray.removeAt(0);
  //   }
  // };

  getPriceBySize(sizeId) {
    if (sizeId && this.product) {
      let sizeObj = this.product.productInfo.variants[0].sizeVariants.find(
        (size) => size.sizeId == sizeId
      );
      if (this.purchaseType == 3) {
        if (sizeObj.storePrice)
          return sizeObj.storePrice + (this.product.productInfo.totalPrice - this.product.productInfo.price)
        else
          return this.calculateStorePrice(sizeObj.sellingPrice) + (this.product.productInfo.totalPrice - this.product.productInfo.price)
      } else {
        return sizeObj.sellingPrice
      }
    } else {
      return 0;
    }
  }

  calculateStorePrice(price) {
    price = Math.ceil(price);

    if (price < 10) price = price + 1;
    else price = price + 2;

    return price;
  }

  getTotalQuantity() {

    let cartItemGrids = this.quantityGroup.controls.cartItemGrids.value;
    // const basePrice = this.product ? this.purchaseType == 3 ? this.product.productInfo.totalPrice : this.product.productInfo.price : 0
    let totalQuantity = 0,
      totalPrice = 0,
      namePersonalizationQuantity = 0,
      numberPersonalizationQuantity = 0,
      personalizedQuantity = 0
    // personalizationPrice = 0
    for (let i = 0; i < cartItemGrids.length; i++) {
      let price = this.getPriceBySize(cartItemGrids[i].size);
      // let personalization = 0;
      let personalizationType = 0;
      if (cartItemGrids[i].personalize) {
        if (cartItemGrids[i].name) {
          // personalization += 7;
          personalizationType = 1;
          namePersonalizationQuantity += cartItemGrids[i].quantity
        } else {
          personalizationType = 0;
        }
        if (
          cartItemGrids[i].number != null &&
          cartItemGrids[i].number.toString().trim()
        ) {
          numberPersonalizationQuantity += cartItemGrids[i].quantity
          // personalization += 6;
          if (personalizationType == 1) {
            personalizationType = 3;
          } else {
            personalizationType = 2;
          }
        }
        personalizedQuantity += Number(cartItemGrids[i].quantity);
      }

      // this.quantityGroup.controls.cartItemGrids["controls"][i]
      //   .get("totalPrice")
      //   .setValue(
      //     Number(cartItemGrids[i].quantity) * (price + personalization)
      //   );

      // this.quantityGroup.controls.cartItemGrids["controls"][i]
      //   .get("personalizationPrice")
      //   .setValue(Number(cartItemGrids[i].quantity) * personalization);

      this.quantityGroup.controls.cartItemGrids["controls"][i]
        .get("personalizationType")
        .setValue(personalizationType);

      totalQuantity += Number(cartItemGrids[i].quantity);

      // personalizationPrice +=
      //   Number(cartItemGrids[i].quantity) * personalization;

      totalPrice +=
        Number(cartItemGrids[i].quantity) * (price); // + personalization
    }

    this.quantityGroup.patchValue({
      quantity: totalQuantity,
      price: totalPrice.toFixed(2),
      namePersonalizationQuantity,
      numberPersonalizationQuantity
      // totalPrice,
      // personalizationPrice,
      // personalizedQuantity,
    });
    this.getDecoPrice(true)
  }

  onImgClick(src) {
    $(".img-holder").attr("src", src);
  }

  onPersonalizeCheck(i) {
    let formGroup = this.quantityGroup.get("cartItemGrids")["controls"][i];
    if (formGroup.controls.personalize.value) {
      formGroup.controls.name.enable();
      formGroup.controls.number.enable();
    } else {
      formGroup.controls.name.setValue("");
      formGroup.controls.number.setValue("");
      formGroup.controls.name.disable();
      formGroup.controls.number.disable();
    }
  }

  isPersonalized() {
    let isPersonalized = false;
    let isPersonalizationValid = true;
    this.quantityGroup.get("cartItemGrids")["controls"].forEach((element) => {
      if (element.value.personalize) {
        isPersonalized = true;
        if (!element.value.name && !element.value.number)
          isPersonalizationValid = false;
      }
    });
    return { isPersonalizationValid, isPersonalized }
  }

  getPersonalizationServices() {
    this.sharedServices.getPersonalizationServices({ internal: false }).subscribe((res: any) => {
      this.personalizationServices = res.data
    })
  }

  getPersonalizationTypes() {
    this.storeService.getPersonalizationTypes().subscribe(res => {
      this.personalizationTypes = res.data
      this.createPersonalizationPropertiesForm()
    })
  }

  getAvailableInkColors() {
    this.storeService.getAvailableInkColors().subscribe((response) => {
      this.inkColorArray = response.data;
    });
  }

  getInkColorsByService(i) {
    let serviceId = this.personalizationPropertiesForm.value[i].serviceId
    if (serviceId)
      return this.inkColorArray.find(color => color.serviceId == serviceId).colors
    return []
  }

  getFontByService(i) {
    let serviceId = this.personalizationPropertiesForm.value[i].serviceId
    let typeId = this.personalizationPropertiesForm.value[i].personalizationTypeId
    if (serviceId && typeId) {
      let personalizationTypes = this.personalizationServices.find(service => service.id == serviceId).personalizationTypes
      if (personalizationTypes && personalizationTypes.length) {
        let type = personalizationTypes.find(type => type.id == typeId)
        if (type)
          return type.fonts
      }
    }
    return []
  }


  getSizesByService(i) {
    try {
      let serviceId = this.personalizationPropertiesForm.value[i].serviceId
      let typeId = this.personalizationPropertiesForm.value[i].personalizationTypeId
      if (serviceId && typeId) {
        let personalizationTypes = this.personalizationServices.find(service => service.id == serviceId).personalizationTypes
        if (personalizationTypes && personalizationTypes.length) {
          let type = personalizationTypes.find(type => type.id == typeId)
          if (type)
            return type.sizes
        }
      }
      return []
    } catch (error) {
      return []
    }
  }

  getDecoGroup() {
    this.productService.getDecoGroup(this.product.productInfo.decoGroupId).subscribe(res => {
      this.decoGroup = res.body.data
    })
  }

  createDecorationProperties(sides) {
    sides.forEach(side => {
      if (side.is_designed) {
        side.assets_doc_path.forEach(art => {
          this.decorationPropertiesForm.push(this.createDecorationPropertyGroup({ art }))
        })
      }
    })
  }

  createDecorationPropertyGroup(obj) {
    return this.formBuilder.group({
      art: obj.art,
      id: obj.id || 0,
      positionId: this.formBuilder.control(obj.positionId || '', Validators.required),
      serviceId: this.formBuilder.control(obj.serviceId || '', Validators.required),
      sizeId: this.formBuilder.control(obj.sizeId || ''),
      colorId: this.formBuilder.control(obj.colorId || [], Validators.required),
      colorCount: this.formBuilder.control(obj.colorCount || '', Validators.required)
    })
  }

  getDecoServices(i, type = 'deco') {
    if (type == 'deco') {
      var positionId = this.decorationPropertiesForm.value[i].positionId
    } else {
      var positionId = this.personalizationPropertiesForm.value[i].positionId
    }
    if (positionId && this.decoGroup) {
      return this.decoGroup.locations.find(loc => loc.id == positionId).services
    }
    return []
  }

  getDecoInkColors(i) {
    let serviceId = this.decorationPropertiesForm.value[i].serviceId
    if (serviceId && this.inkColorArray)
      return this.inkColorArray.find(color => color.serviceId == serviceId).colors
    return []
  }

  updateColorCount(i) {
    this.decorationPropertiesForm.controls[i].get('colorCount')
      .setValue(this.decorationPropertiesForm.value[i].colorId.length)
  }

  zoomIn(event) {
    let pre = document.getElementById("zoom-preview");
    pre.style.display = "inline";
    let src = event.target.currentSrc
    pre.style.backgroundImage = `url('${src}')`;
    let posX = event.offsetX + Math.trunc((event.offsetX / 100) * 40);
    let posY = event.offsetY + Math.trunc((event.offsetY / 100) * 40);
    pre.style.backgroundPosition = (-posX) + "px " + (-posY) + "px";
  }

  zoomOut() {
    let pre = document.getElementById("zoom-preview");
    pre.style.display = "none";
  }

  getDecoPrice(isSilent?) {

    let { isPersonalized } = this.isPersonalized()
    let isNamePersonalizationPropertiesValid = false
    let isNumberPersonalizationPropertiesValid = false
    this.personalizationPropertiesForm.controls.forEach(control => {
      if (control.value.personalizationTypeId == 1 && control.valid)
        isNamePersonalizationPropertiesValid = true
      else if (control.value.personalizationTypeId == 2 && control.valid)
        isNumberPersonalizationPropertiesValid = true
    })
    let isDesigned = this.purchaseType == 2
    let data = []
    let totalQuantity = this.quantityGroup.get('quantity').value
    this.decoPrice = null
    let storeData = {
      "storeId": this.teamStoreId,
      "mapCode": this.mapCode,
      "personalizationNameQty": 0,
      "personalizationNumberQty": 0,
      "totalQty": totalQuantity
    }

    if (isDesigned) {
      let decoPropertyArr = this.decorationPropertiesForm.value
      decoPropertyArr.forEach(el => {
        data.push(this.createDecoPriceApiObj(
          totalQuantity,
          el.colorCount,
          3, // itemType - color
          el.serviceId,
          el.colorId
        ))
      })
    }

    if (isPersonalized) {
      let personalizationPropertyArr = this.personalizationPropertiesForm.value
      personalizationPropertyArr.forEach(el => {
        if (el.personalizationTypeId == 1 || el.personalizationTypeId == 3)
          storeData.personalizationNameQty += this.quantityGroup.get('namePersonalizationQuantity').value
        if (el.personalizationTypeId == 2 || el.personalizationTypeId == 3)
          storeData.personalizationNumberQty += this.quantityGroup.get('numberPersonalizationQuantity').value
        let count = el.personalizationTypeId == 0 ? 0 :
          el.personalizationTypeId == 1 ?
            this.quantityGroup.get('namePersonalizationQuantity').value :
            this.quantityGroup.get('numberPersonalizationQuantity').value // if type = 3 both qty are same
        if (count) {
          data.push(this.createDecoPriceApiObj(
            count,
            el.sizeId,
            el.personalizationTypeId, // itemType - 1,2
            el.serviceId,
            [el.colorId]
          ))
        }
      });
    }

    if (this.purchaseType == 3 && totalQuantity) {
      this.decoPrice = {
        decoPrice: 0,
        namePrice: 7,
        numberPrice: 5,
      }
      // this.sharedServices.getStoreDecoPrice(storeData).subscribe(res => {
      //   this.decoPrice = res.data
      // })
      return
    } else {
      if (!isDesigned && !isPersonalized) {
        // this.quantityGroup.get('decoPrice').setValue(0)
        return
      } else if (isDesigned && this.decorationPropertiesForm.valid == false) {
        if (!isSilent)
          this.commonService.openErrorSnackBar("Please complete decoration settings to calculate total price", "")
        // this.quantityGroup.get('decoPrice').setValue(0)
        return
      } else if (isPersonalized &&
        ((storeData.personalizationNameQty && !isNamePersonalizationPropertiesValid) ||
          (storeData.personalizationNumberQty && !isNumberPersonalizationPropertiesValid))
      ) {
        if (!isSilent)
          this.commonService.openErrorSnackBar("Please complete personalization settings to calculate total price", "")
        // this.quantityGroup.get('decoPrice').setValue(0)
        return
      } else if (!totalQuantity) {
        // this.quantityGroup.get('decoPrice').setValue(0)
        this.decoPrice = {
          decoPrice: 0,
          namePrice: 0,
          numberPrice: 0,
        }
        return
      } else if (!data.length) {
        this.decoPrice = {
          decoPrice: 0,
          namePrice: 0,
          numberPrice: 0,
        }
        return
      } else {
        this.decoPrice = {
          decoPrice: 0,
          namePrice: 0,
          numberPrice: 0,
        }
        this.decoPriceLoading = true
        this.sharedServices.getDecoPriceByProperties(data).subscribe(res => {
          this.decoPriceLoading = false
          this.decoPrice = res.data
        })
      }
    }
  }

  createDecoPriceApiObj(count, itemValue, itemType, serviceId, colorIds) {
    return { count, itemValue, itemType, serviceId, colorIds }
  }

  isDecorated() {
    if (
      this.isPersonalized().isPersonalized ||
      this.purchaseType == 2
    ) {
      return true
    }
    return false
  }

  calculateTotalPrice() {
    // if (this.purchaseType == 3) {
    //   this.decoPrice = {
    //     namePrice: 0,
    //     numberPrice: 0,
    //     decoPrice: 0,
    //   }
    // }
    let cartItemGrids = this.quantityGroup.controls.cartItemGrids;
    let totalPrice = 0
    for (let i = 0; i < cartItemGrids.value.length; i++) {
      if (!cartItemGrids.value[i].size || !cartItemGrids.value[i].quantity)
        continue
      let basePrice = this.getPriceBySize(cartItemGrids.value[i].size)
      let quantity = cartItemGrids.value[i].quantity
      let personalizationPrice = 0
      if (cartItemGrids.value[i].personalizationType == 3 || cartItemGrids.value[i].personalizationType == 1) {
        cartItemGrids['controls'][i].get('personalizationNamePrice').setValue(quantity * this.decoPrice.namePrice)
        personalizationPrice += (quantity * this.decoPrice.namePrice)
      }
      if (cartItemGrids.value[i].personalizationType == 3 || cartItemGrids.value[i].personalizationType == 2) {
        cartItemGrids['controls'][i].get('personalizationNumberPrice').setValue(quantity * this.decoPrice.numberPrice)
        personalizationPrice += (quantity * this.decoPrice.numberPrice)
      }
      if (!cartItemGrids.value[i].personalizationType) {
        cartItemGrids['controls'][i].get('personalizationNamePrice').setValue(0)
        cartItemGrids['controls'][i].get('personalizationNumberPrice').setValue(0)
      }
      cartItemGrids['controls'][i].get('decoPrice').setValue(quantity * this.decoPrice.decoPrice)
      cartItemGrids['controls'][i].get('totalPrice').setValue(
        (quantity * (this.decoPrice.decoPrice + basePrice)) + personalizationPrice
      )
      totalPrice += ((quantity * (this.decoPrice.decoPrice + basePrice)) + personalizationPrice)
    }
    this.quantityGroup.get('totalPrice').setValue(totalPrice.toFixed(2))
    if (this.decoPrice)
      this.quantityGroup.get('decoPrice').setValue(this.decoPrice.decoPrice * this.quantityGroup.value.quantity)
    return totalPrice.toFixed(2)
  }

  onDecoLocationChange(i, type) {
    if (type == 'deco') {
      this.decorationPropertiesForm.controls[i].patchValue({
        serviceId: '',
        sizeId: '',
        colorId: '',
        colorCount: '',
      })
    } else {
      this.personalizationPropertiesForm.controls[i].patchValue({
        serviceId: '',
        sizeId: '',
        colorId: '',
        fontId: '',
      })
    }
  }

  onDecoServiceChange(i, type){
    if (type == 'deco') {
      this.decorationPropertiesForm.controls[i].patchValue({
        sizeId: '',
        colorId: '',
        colorCount: '',
      })
    } else {
      this.personalizationPropertiesForm.controls[i].patchValue({
        sizeId: '',
        colorId: '',
        fontId: '',
      })
    }
  }

  isDecoLocationSelected(id){
    let usedPositions = []
    this.decorationPropertiesForm.controls.forEach(control=>{
      if(control.value.positionId)
        usedPositions.push(control.value.positionId)
    })
    this.personalizationPropertiesForm.controls.forEach(control=>{
      if(control.value.positionId)
        usedPositions.push(control.value.positionId)
    })
    return usedPositions.includes(id)
  }
}
