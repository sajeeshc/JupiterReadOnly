import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "src/app/core/services/product.service";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";
import { StoreService } from "src/app/core/services/store.service";
import { DatePipe } from "@angular/common";
import { CommonService } from "src/app/core/services/common.service";
import { map, reduce, startWith } from "rxjs/operators";
import { readlinkSync } from "fs";
import { Observable } from "rxjs";
import { stringify } from "@angular/compiler/src/util";
import { SharedService } from "src/app/core/services/shared.service";

declare var componentHandler: any;
declare var $: any;
import Swal from "sweetalert2";

@Component({
  selector: "app-store-specification",
  templateUrl: "./store-specification.component.html",
  styleUrls: ["./store-specification.component.scss"],
})
export class StorespecificationComponent implements OnInit {
  @ViewChild("colorSelect", null) colorSelect;
  previousColorSelectValues = [];
  storeRequestForm: FormGroup;
  teamStoreId: any;
  garmentsRequested: FormArray;
  artMapping: FormArray;
  teamStoreGarmentPersonalizations: FormArray;
  categoryList: any = [];
  productList: any = [];
  selectedProducts: any = [];
  selectedCategory: any;
  selectedProduct: any;
  artArray: any[] = [];
  imageUrl: any = "";
  dataSource: any;
  teamStoreObj: any[];
  isShowDiv: boolean;
  user: any;
  color: String = "red";
  colorArray: any[] = [];
  selectedInkColorArray: any[] = [];
  inkColors: any[] = [];
  inkColorArray: any[] = [];
  public productFormControl: FormControl;
  filteredProductList: Observable<any[]>;
  position: any = true;
  fontArray: any[] = [];
  serviceArray: any[] = [];
  personalizationServiceArray: any[] = [];
  sizeArray: any;
  positionArray: any;
  selectedColorArray: any[] = [];
  productColorArray: any[] = [];
  productLocationArray: any[] = [];
  selectedLocationArray: any[] = [];
  personalizationTypeArray: any[] = [];
  selectedPersonalizationTypeArray: any[] = [];
  personalizationTypes: any;
  totalPersonalizationCost: any = 0;
  selectedArtColors = new FormControl([]);
  selectedArtMap: FormGroup;
  teamStoreForArray: any[] = [];
  teamStoreInfoObj: any;
  selectedCategoriesList: any[] = [];
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  servicePriceList = [];
  rejectionCodes = [];
  selectedRejectionCodes: any[];
  rejectionText: string;
  designerIcon = "../../../../assets/images/graphic-designer.png";
  designedIcon = "../../../../assets/images/designed-icon-2.png";
  paginator = {
    length: 0,
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    pageIndex: 1,
  };
  filterParams = {
    minPrice: 0,
    maxPrice: 500,
    name: "",
    styleName: "",
    colors: [],
    categories: [],
    sizes: [],
    brands: [],
    vendorName: [],
    filterText: "",
  };
  vendorList = [];

  personalizationServicesWithFontSize = [
    {
      id: 2,
      name: "Embroidery",
      personalizationTypes: [
        {
          id: 1,
          name: "Name",
          fonts: [
            { id: 1, name: "Block 2" },
            { id: 2, name: "Script 2" },
            { id: 7, name: "Zero Twos" },
          ],
          sizes: [{ id: 1, sizeName: '1/2"' }],
        },
        {
          id: 2,
          name: "Number",
          fonts: [
            { id: 3, name: "College" },
            { id: 1, name: "Block 2" },
          ],
          sizes: [
            { id: 1, sizeName: '1/2"' },
            { id: 9, sizeName: '1"' },
          ],
        },
      ],
    },
    {
      id: 11,
      name: "Heat Press",
      personalizationTypes: [
        {
          id: 1,
          name: "Name",
          fonts: [
            { id: 7, name: "Zero Twos" },
            { id: 8, name: "Eagles (Varsity)" },
            { id: 9, name: "Lancers (Sports Night NS)" },
            { id: 10, name: "Blue Aces (Old English)" },
            { id: 11, name: "Knights (Grave Digger)" },
            { id: 12, name: "Wolves (Brush Script)" },
            { id: 13, name: "Braves (Pointedly Mad)" },
            { id: 14, name: "Bulldogs (Memphis TBol)" },
            { id: 15, name: "Broncos (Strenuous)" },
            { id: 16, name: "Cavaliers (Abaddon)" },
            { id: 17, name: "Wildcats (Acklin)" },
            { id: 18, name: "Longhorns (Poplar Std Black)" },
            { id: 19, name: "Patriots (Bullpen)" },
            { id: 20, name: "Rockets (Nasilization)" },
            { id: 21, name: "Pirates (Marlboro Regular)" },
            { id: 22, name: "Falcons (Red Circle)" },
            { id: 23, name: "Cowboys (Frankline Gothic Heavy)" },
            { id: 24, name: "Hornets (Arial Rounded Bold)" },
            { id: 25, name: "Trojans (ITC Machine)" },
            { id: 26, name: "Redskins (Dawn Castle)" },
            { id: 27, name: "Cardinals (Benquiat Bold)" },
            { id: 28, name: "Monarch (Windsor)" },
            { id: 29, name: "Ballentines Bold" },
            { id: 30, name: "An Absolute Empire" },
            { id: 31, name: "Spartans (NCAA Michigan State Spartans)" },
            { id: 33, name: "Cooperblack" },
            { id: 34, name: "MLB Tuscan" },
            { id: 35, name: "Thirsty Script md" },
            { id: 36, name: "Serpentine Bold" },
          ],
          sizes: [{ id: 3, sizeName: '2"' }],
        },
        {
          id: 2,
          name: "Number",
          fonts: [
            { id: 4, name: "Varsity" },
            { id: 5, name: "Monarch" },
            { id: 6, name: "Pride" },
            { id: 37, name: "Spartans" },
          ],
          sizes: [
            { id: 3, sizeName: '2"' },
            { id: 4, sizeName: '4"' },
            { id: 5, sizeName: '6"' },
            { id: 6, sizeName: '8"' },
            { id: 7, sizeName: '10"' },
          ],
        },
      ],
    },
    {
      id: 12,
      name: "Tackle Twill",
      personalizationTypes: [
        {
          id: 1,
          name: "Name",
          fonts: [
            { id: 7, name: "Zero Twos" },
            { id: 8, name: "Eagles (Varsity)" },
            { id: 9, name: "Lancers (Sports Night NS)" },
            { id: 10, name: "Blue Aces (Old English)" },
            { id: 11, name: "Knights (Grave Digger)" },
            { id: 12, name: "Wolves (Brush Script)" },
            { id: 13, name: "Braves (Pointedly Mad)" },
            { id: 14, name: "Bulldogs (Memphis TBol)" },
            { id: 15, name: "Broncos (Strenuous)" },
            { id: 16, name: "Cavaliers (Abaddon)" },
            { id: 17, name: "Wildcats (Acklin)" },
            { id: 18, name: "Longhorns (Poplar Std Black)" },
            { id: 19, name: "Patriots (Bullpen)" },
            { id: 20, name: "Rockets (Nasilization)" },
            { id: 21, name: "Pirates (Marlboro Regular)" },
            { id: 22, name: "Falcons (Red Circle)" },
            { id: 23, name: "Cowboys (Frankline Gothic Heavy)" },
            { id: 24, name: "Hornets (Arial Rounded Bold)" },
            { id: 25, name: "Trojans (ITC Machine)" },
            { id: 26, name: "Redskins (Dawn Castle)" },
            { id: 27, name: "Cardinals (Benquiat Bold)" },
            { id: 28, name: "Monarch (Windsor)" },
            { id: 29, name: "Ballentines Bold" },
            { id: 30, name: "An Absolute Empire" },
            { id: 31, name: "Spartans (NCAA Michigan State Spartans)" },
            { id: 33, name: "Cooperblack" },
            { id: 34, name: "MLB Tuscan" },
            { id: 35, name: "Thirsty Script md" },
            { id: 36, name: "Serpentine Bold" },
          ],
          sizes: [{ id: 3, sizeName: '2"' }],
        },
        {
          id: 2,
          name: "Number",
          fonts: [
            { id: 4, name: "Varsity" },
            { id: 5, name: "Monarch" },
            { id: 6, name: "Pride" },
            { id: 37, name: "Spartans" },
          ],
          sizes: [
            { id: 3, sizeName: '2"' },
            { id: 4, sizeName: '4"' },
            { id: 5, sizeName: '6"' },
            { id: 6, sizeName: '8"' },
            { id: 7, sizeName: '10"' },
          ],
        },
      ],
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private storeBuilderService: StorebuilderService,
    private storeService: StoreService,
    private productService: ProductService,
    private router: Router,
    private commonService: CommonService,
    private sharedService: SharedService
  ) {
    this.productFormControl = new FormControl();
  }

  ngOnInit() {
    this.createStoreSpecificationForm();
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.getPersonalizationTypes();
    this.getTeamStore(this.teamStoreId);
    this.getProductCategory();
    this.getAvailableStoreColors();
    this.getAvailableInkColors();
    this.getAvailableStoreServices();
    this.getAvailableStoreFonts();
    this.getAvailableStoreProductPositions();
    this.getAvailableProductSizes();
    this.user = parseInt(localStorage.getItem("user"));
    this.getAllServiceWithPrice();
    // this.storeRequestForm.disable()
    this.getStoreRejectionCodes();
    this.getProducts();
    this.getVendorList()
    localStorage.removeItem("builderDesignedProductIndex");
    this.commonService.setChangesSavedValue(false)
  }

  updateFilterOptions() {
    this.filteredProductList = this.productFormControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  getProductById(id) {
    document.getElementById("addProductModal2").classList.add("loading-cursor");
    this.productService.getProductDetail(id).subscribe((res) => {
      this.productSelected(res.products);
      $("#addProductModal2").modal("hide");
      document
        .getElementById("addProductModal2")
        .classList.remove("loading-cursor");
    });
  }

  productSelection(productId) {
    // let productId = event.option.value.split(" - ")[0]
    this.getProductById(productId);
    // if (this.productList.length > 0 && product.name != null && product.name != undefined) {
    //   var selectedItem = this.productList.find(x => x.name === product.name);
    //   this.productFormControl.patchValue({ productId: selectedItem.id });
    //   this.productSelected(selectedItem);
    //   return selectedItem.name;
    // }
  }

  createStoreSpecificationForm() {
    this.storeRequestForm = this.formBuilder.group({
      id: 0,
      garmentsRequested: this.formBuilder.array([]),
      artsRequested: [],
      customerNotes: new FormControl(""),
      selectedArts: [],
      stage: "",
    });
  }

  createProductForm(): FormGroup {
    return this.formBuilder.group({
      productId: 0,
      styleName: "",
      teamStoreId: this.teamStoreId,
      personalize: false,
      sku: [""],
      productName: [""],
      displayName: [""],
      color: [""],
      price: [],
      discount: [],
      fundraiserAmount: [],
      fundraiserPercentage: [],
      decoPrice: [],
      total: [],
      artMapping: this.formBuilder.array([]),
      teamStoreGarmentPersonalizations: this.formBuilder.array([]),
    });
  }

  updateProductPriceOnColorChange() { }

  addProduct(productDetail): FormGroup {
    // let price = Math.ceil(Number(productDetail.price));
    // price = price >= 20 ? price + 2 : price + 1;
    let price = productDetail.variants[0].sizeVariants[0].storePrice;
    if (!price) {
      price = Math.ceil(
        Number(productDetail.variants[0].sizeVariants[0].sellingPrice)
      );
      price = price >= 20 ? price + 2 : price + 1;
    }
    let mapCode =
      new Date().getTime() + "" + Math.floor(Math.random() * 10000 + 1);
    return this.formBuilder.group({
      discountStatus: 0,
      mapCode,
      productId: productDetail.id,
      styleName: productDetail.styleName,
      teamStoreId: this.teamStoreId,
      personalize: false,
      sku: productDetail.sku,
      productName: productDetail.name,
      displayName: productDetail.name,
      color: [""],
      price: price.toFixed(2),
      discount: [0],
      fundraiserAmount: [0],
      fundraiserPercentage: [0],
      decoPrice: [0],
      total: [],
      artMapping: this.formBuilder.array([
        this.createArtAssignmentForm(productDetail.id, 1, null, mapCode),
      ]),
      teamStoreGarmentPersonalizations: this.formBuilder.array([]),
    });
  }

  createArtAssignmentForm(productId, serviceId, color, mapCode): FormGroup {
    return this.formBuilder.group({
      id: 0,
      src: [""],
      teamStoreId: this.teamStoreId,
      productId: productId,
      positionId: ["", Validators.required],
      serviceId: [serviceId, Validators.required],
      noOfColors: [1],
      colors: ["", Validators.required],
      // primaryColorId: [''],
      // secondaryColorId: [''],
      // tertiaryColorId: [''],
      // threadCount: [0],
      decoPrice: [0],
      mapCode,
    });
  }

  createPersonalizationForm() {
    return this.formBuilder.group({
      personalizedTypeId: "",
      personalizedLocationId: "",
      personalizedServiceId: "",
      personalizedColorId: "",
      personalizedSizeId: "",
      personalizedFontId: "",
      personalizedCost: 0,
    });
  }

  getProductCategory() {
    this.productService.getProductCategory().subscribe(
      (response) => {
        this.categoryList = response.body.data;
        // this.getProduct(this.categoryList[0].id);
      },
      (error) => { }
    );
  }

  getProduct(categoryId: any) {
    this.productService.getProduct(categoryId).subscribe(
      (response) => {
        this.productList = response.body.data;
        this.updateFilterOptions();
      },
      (error) => { }
    );
  }

  getAvailableStoreColors() {
    this.storeService.getAvailableStoreColors().subscribe((response) => {
      this.colorArray = response.data;
    });
  }
  getAvailableInkColors() {
    this.storeService.getAvailableInkColors({internal:true}).subscribe((response) => {
      this.inkColorArray = response.data;
    });
  }

  getAvailableStoreServices() {
    this.storeService.getAvailableStoreServices().subscribe((response) => {
      this.serviceArray = response.data;
      this.personalizationServiceArray = this.serviceArray.filter(function (
        obj
      ) {
        return obj.id != 1;
      });
    });
  }
  getAvailableStoreFonts() {
    this.storeService.getAvailableStoreFonts().subscribe(
      (response) => {
        this.fontArray = response.data;
      },
      (error) => { }
    );
  }

  getPersonalizationTypes() {
    this.storeService.getPersonalizationTypes().subscribe(
      (response) => {
        this.personalizationTypes = response.data;
      },
      (error) => { }
    );
  }

  getAvailableStoreProductPositions() {
    this.storeService.getAvailableStoreProductPositions(0).subscribe(
      (response) => {
        this.positionArray = response;
      },
      (error) => { }
    );
  }

  getProductColor(productId, i, setDefault?) {
    this.storeService.getProductColors(productId).subscribe(
      (response) => {
        this.productColorArray[i] = response.data;
        if (setDefault) {
          this.garmentsRequested.controls[i]
            .get("color")
            .setValue(this.productColorArray[i][0].id);
          this.onGarmentColorChange(this.productColorArray[i][0].id, i);
        }
      },
      (error) => {
        this.productColorArray[i] = [];
      }
    );
  }

  getProductLocations(productId, i) {
    this.storeService.getProductLocations(productId).subscribe(
      (response) => {
        this.productLocationArray[i] = response.data.locations;
      },
      (error) => {
        this.productLocationArray[i] = [];
      }
    );
    this.selectedLocationArray.push([]);
  }

  locationSelected(i, j, itemId, artMap, garment, artMapping, index) {
    this.selectedLocationArray[i][j] = itemId;
    this.getDecoPricing(artMap, j, garment, artMapping, index);
  }

  getDecoPricing(artMap, j, garment, artMapping, index) {
    let prevService = [];
    for (let i = 0; i < artMapping.controls.length; i++) {
      let serviceId = artMapping.controls[i].get("serviceId").value;
      let colorCount = artMapping.controls[i].get("noOfColors").value;
      let service = this.servicePriceList.find((s) => s.id == serviceId);
      let decoPrice = 0;
      if (prevService.includes(serviceId) == false) {
        prevService.push(artMapping.controls[i].value.serviceId);
        decoPrice = service.firstPrice[colorCount - 1];
      } else {
        decoPrice = service.secondPrice[colorCount - 1];
      }
      artMapping.controls[i].patchValue({ decoPrice });
    }

    this.calculateDecoPricing(garment, artMapping);
    // if(artMap.get('serviceId').value!=null && artMap.get('noOfColors').value != null
    // && artMap.get('positionId').value != null && artMap.get('noOfColors').value != ''){
    //   this.storeService.getDecoPricing(artMap.get('serviceId').value,
    //    artMap.get('noOfColors').value,artMap.get('positionId').value,j+1).subscribe(
    //     (response) => {
    //       artMap.patchValue({ decoPrice: Number(response.data).toFixed(2) });
    //       this.calculateDecoPricing(garment, artMapping);
    //     },
    //     (error) => {
    //       artMap.patchValue({ decoPrice: 0.00 });
    //       this.calculateDecoPricing(garment, artMapping);
    //     }
    //   );
    // }
  }

  getStoreRejectionCodes() {
    this.storeService.getTeamStoreRejectionCodes().subscribe(
      (response) => {
        this.rejectionCodes = response.data;
        this.setRejectionCodes();
      },
      (error) => { }
    );
  }

  getAvailableProductSizes() {
    this.storeService.getAvailableProductSizes().subscribe(
      (response) => {
        this.sizeArray = response;
      },
      (error) => { }
    );
  }

  setRejectionCodes() {
    this.selectedRejectionCodes = [];

    if (this.teamStoreInfoObj.stage == 7) {
      this.selectedRejectionCodes = this.filterRejectionCodes(
        this.teamStoreInfoObj.amStoreRejectionCodes
      );
      this.rejectionText = this.teamStoreInfoObj.amStoreRejectionText;
    } else if (this.teamStoreInfoObj.stage == 19) {
      this.selectedRejectionCodes = this.filterRejectionCodes(
        this.teamStoreInfoObj.customerStoreRejectionCodes
      );
      this.rejectionText = this.teamStoreInfoObj.customerStoreRejectionText;
    }
  }

  filterRejectionCodes(codes): any[] {
    let tempCodes = codes.split(",").map(function (item) {
      return parseInt(item, 10);
    });

    let rejCodesArray = [];

    tempCodes.forEach((item) => {
      let code = this.rejectionCodes.filter((obj) => obj.id == item);
      rejCodesArray.push(code[0]);
    });

    return rejCodesArray;
  }

  updatePersonalize(event, control, i) {
    if (event.checked) {
      this.addPersonalization(control);
    } else {
      control.clear();
      this.resetPersonalizationPositions(i)
    }
    // this.removepersonalization(control, i, 0)
  }

  storeListColumns: string[] = [
    "storeName",
    "storeOwner",
    "orderNumber",
    "accountManager",
    "assignedTo",
  ];

  setArtAssignmentForm(art) {
    return this.formBuilder.group({
      id: art.id,
      src: art.src,
      teamStoreId: art.teamStoreId,
      productId: art.productId,
      positionId: [art.positionId, Validators.required],
      serviceId: [art.serviceId, Validators.required],
      noOfColors: art.noOfColors,
      colors: [art.colors, Validators.required],
      artId: art.artId,
      // primaryColorId: art.primaryColorId,
      // secondaryColorId: art.secondaryColorId,
      // tertiaryColorId: art.tertiaryColorId,
      // threadCount: art.threadCount,
      decoPrice: Number(art.decoPrice).toFixed(2),
      mapCode: art.mapCode,
    });
  }

  setPersonalizationForm(personalization) {
    return this.formBuilder.group({
      personalizedTypeId: personalization.personalizedTypeId,
      personalizedLocationId: personalization.personalizedLocationId,
      personalizedServiceId: personalization.personalizedServiceId,
      personalizedColorId: personalization.personalizedColorId,
      personalizedSizeId: personalization.personalizedSizeId,
      personalizedFontId: personalization.personalizedFontId,
      personalizedCost: personalization.personalizedCost,
    });
  }

  setGarmentsForm(
    productDetail,
    artsRequested,
    personalizations,
    index
  ): FormGroup {
    let form = this.formBuilder.group({
      discountStatus: productDetail.discountStatus,
      mapCode: productDetail.mapCode,
      productId: productDetail.productId,
      styleName: productDetail.styleName,
      isDesigned: productDetail.isDesigned,
      teamStoreId: this.teamStoreId,
      personalize: productDetail.personalize,
      sku: 0,
      productName: productDetail.productName,
      displayName: productDetail.displayName,
      color: productDetail.color,
      price: Number(productDetail.price).toFixed(2),
      discount: Number(productDetail.discount).toFixed(2),
      fundraiserAmount: Number(productDetail.fundraiserAmount).toFixed(2),
      fundraiserPercentage: productDetail.fundraiserPercentage,
      decoPrice: Number(productDetail.decoPrice).toFixed(2),
      total: Number(productDetail.total).toFixed(2),
      artMapping: this.formBuilder.array([]),
      teamStoreGarmentPersonalizations: this.formBuilder.array([]),
    });

    this.selectedLocationArray.push([]);
    this.artMapping = form.get("artMapping") as FormArray;
    for (let i = 0; i < artsRequested.length; i++) {
      if (
        productDetail.productId == artsRequested[i].productId &&
        productDetail.mapCode == artsRequested[i].mapCode
      ) {
        this.artMapping.push(this.setArtAssignmentForm(artsRequested[i]));
        this.selectedLocationArray[index].push(artsRequested[i].positionId);
      }
    }

    this.selectedPersonalizationTypeArray.push([]);
    this.teamStoreGarmentPersonalizations = form.get(
      "teamStoreGarmentPersonalizations"
    ) as FormArray;
    for (let i = 0; i < personalizations.length; i++) {
      this.teamStoreGarmentPersonalizations.push(
        this.setPersonalizationForm(personalizations[i])
      );
      this.selectedPersonalizationTypeArray[index].push(
        personalizations[i].personalizedTypeId
      );
      this.selectedLocationArray[index][i + 5] = personalizations[i].personalizedLocationId
    }
    return form;
  }

  createArtArray(artRequested) {
    let flags = [],
      output = [],
      l = artRequested.length,
      i;
    for (i = 0; i < l; i++) {
      if (flags[artRequested[i].src]) continue;
      flags[artRequested[i].src] = true;
      output.push(artRequested[i].src);
    }
    return output;
  }

  getTeamStore(teamStoreId) {
    this.commonService.toggleLoading(true)
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe(
      (response) => {
        this.commonService.toggleLoading(false)
        let teamStore = response.data;
        this.teamStoreInfoObj = response.data;
        // this.artArray = this.createArtArray(teamStore.selectedArts);
        this.storeRequestForm.setValue({
          id: teamStore.id,
          garmentsRequested: [],
          artsRequested: teamStore.artsRequested,
          customerNotes: teamStore.customerNotes,
          selectedArts: teamStore.selectedArts || [],
          stage: teamStore.stage,
        });
        this.garmentsRequested = this.storeRequestForm.get(
          "garmentsRequested"
        ) as FormArray;
        this.artArray = teamStore.selectedArts || [];
        for (let i = 0; i < teamStore.garmentsRequested.length; i++) {
          this.garmentsRequested.push(
            this.setGarmentsForm(
              teamStore.garmentsRequested[i],
              teamStore.artsRequested,
              teamStore.garmentsRequested[i].teamStoreGarmentPersonalizations,
              i
            )
          );
          this.getProductColor(teamStore.garmentsRequested[i].productId, i);
          this.getProductLocations(teamStore.garmentsRequested[i].productId, i);
          this.selectedPersonalizationType(i);
          this.setPersonalizationInkColors(i, teamStore.garmentsRequested[i].teamStoreGarmentPersonalizations.length)
        }
        this.teamStoreObj = [
          {
            storeName: teamStore.name,
            storeOwner: teamStore.contactName,
            orderNumber: teamStore.id,
            accountManager: teamStore.createdBy.name,
            assignedTo: teamStore.assignedToName,
          },
        ];
        this.dataSource = this.teamStoreObj;

        if (teamStore.teamStoreFor != null)
          this.teamStoreForArray = teamStore.teamStoreFor.split(",");

        this.setAllPersonalizationInkColors();

      },
      (error) => {
        this.commonService.toggleLoading(false)
        this.commonService.openErrorSnackBar(error.message, "");
      }
    );
  }

  updateComponents() {
    setTimeout(function () {
      componentHandler.upgradeAllRegistered();
    }, 10);
  }

  productSelected(productDetail) {
    let productList = this.storeRequestForm.get("garmentsRequested").value;
    const found = productList.some((el) => el.productId === productDetail.id);
    $("#addProductModal").modal("hide");
    if (found) {
      Swal.fire({
        html: "<p>This product is already selected</p>",
        icon: "info",
        confirmButtonText: "Add again",
        cancelButtonText: "Cancel",
        showCancelButton: true,
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.garmentsRequested = this.storeRequestForm.get(
            "garmentsRequested"
          ) as FormArray;
          this.garmentsRequested.push(this.addProduct(productDetail));
          this.getProductColor(productDetail.id, productList.length, true);
          this.getProductLocations(productDetail.id, productList.length);
          this.selectedPersonalizationType(productList.length);
        }
      });
    } else {
      this.garmentsRequested = this.storeRequestForm.get(
        "garmentsRequested"
      ) as FormArray;
      this.garmentsRequested.push(this.addProduct(productDetail));
      this.getProductColor(productDetail.id, productList.length, true);
      this.getProductLocations(productDetail.id, productList.length);
      this.selectedPersonalizationType(productList.length);
    }
    // this.selectedCategory = "";
    this.selectedProduct = {};
    this.productFormControl.reset();
  }

  selectedPersonalizationType(i) {
    this.personalizationTypeArray[i] = this.personalizationTypes;
    this.selectedPersonalizationTypeArray.push([]);
  }

  getTotal(garment) {
    let price = Number(garment.value.price) || 0;
    let fundraiserPercentage = Number(garment.value.fundraiserPercentage) || 0;
    if (!fundraiserPercentage) garment.get('fundraiserPercentage').setValue(0)
    let fundraiserAmount = Number(this.getProductfundraisingAmount(price, fundraiserPercentage)) || 0;
    if (!fundraiserAmount) garment.get('fundraiserPercentage').setValue(0)
    // let discount = Number(garment.value.discount) || 0;
    let decoPrice = Number(garment.value.decoPrice) || 0;
    let total =
      price +
      fundraiserAmount +
      decoPrice
    // + this.totalPersonalizationCost;
    // - discount 
    garment.patchValue({
      total: Number(total).toFixed(2),
      fundraiserAmount: fundraiserAmount,
    });
  }

  getProductfundraisingPercentage(garment) {
    let price = garment.value.price;
    let fundraiserAmount = garment.value.fundraiserAmount;
    let fundraiserPercentage = parseFloat(
      ((fundraiserAmount * 100) / price).toFixed(2)
    );
    garment.patchValue({
      fundraiserPercentage: fundraiserPercentage,
    });
    this.getTotal(garment);
  }

  calculateDecoPricing(garment, artMapping) {
    let totalDecoPricing = 0;
    for (let i = 0; i < artMapping.controls.length; i++) {
      totalDecoPricing += parseInt(artMapping.controls[i].value.decoPrice);
    }
    garment.patchValue({
      decoPrice: Number(totalDecoPricing).toFixed(2),
    });
    this.getTotal(garment);
  }

  personalizationTypeSelected(index, personalize, j, garment, personalization) {
    this.selectedPersonalizationTypeArray[index][j] =
      personalize.controls.personalizedTypeId.value;
    let cost = this.personalizationTypes.find(
      (x) => x.id == personalize.controls.personalizedTypeId.value
    ).cost;
    personalize.patchValue({ personalizedCost: cost });

    this.totalPersonalizationCost = 0;
    for (let i = 0; i < personalization.controls.length; i++) {
      this.totalPersonalizationCost +=
        personalization.controls[i].value.personalizedCost;
    }
    this.getTotal(garment);
  }

  getProductfundraisingAmount(price, fundraiserPercentage) {
    let fundraiserAmount;
    fundraiserAmount = parseFloat(
      ((price * fundraiserPercentage) / 100).toFixed(2)
    );
    return fundraiserAmount;
  }

  addImageLink() {
    if (this.imageUrl && this.imageUrl.trim().length > 6) {
      this.artArray.push({ src: this.imageUrl, artId: 0 });
      this.closeArtModal();
    } else {
      this.commonService.openWarningSnackBar("Please enter a valid URL", "");
    }
  }

  removeArt(removalIndex) {
    this.artArray.splice(removalIndex, 1);
  }

  createArtRequested(garmentsArray) {
    let artArray = [];
    garmentsArray.garmentsRequested.forEach((garment) => {
      garment.artMapping.forEach((art) => {
        artArray.push(art);
      });
    });
    return artArray;
  }

  createStore(action?) {
    let garmentArray = this.storeRequestForm.value;
    if (this.artArray.length != 0) {
      if (
        garmentArray.garmentsRequested != null &&
        garmentArray.garmentsRequested.length != 0
      ) {
        if (this.validateIndividualProductProperties(garmentArray.garmentsRequested)) {
          this.storeRequestForm.controls["artsRequested"].setValue(
            this.createArtRequested(this.storeRequestForm.value)
          );
          this.storeRequestForm.controls["selectedArts"].setValue(
            this.artArray
          );
        } else {
          return
        }
      } else {
        this.commonService.openErrorSnackBar(
          "Please add atleast one product",
          ""
        );
        return;
      }
    } else {
      this.commonService.openErrorSnackBar("Please add atleast one art", "");
      return;
    }
    if (!this.storeRequestForm.valid) {
      this.commonService.openErrorSnackBar("Please enter all required values", "")
      return;
    }
    this.commonService.toggleLoading(true);
    this.storeService.updateStore(this.storeRequestForm.value).subscribe(
      (response) => {
        this.commonService.toggleLoading(false);
        if (response.status == 1) {
          this.commonService.setChangesSavedValue(true)
          this.commonService.openSuccessSnackBar(response.message, "");
          if (action == "design")
            this.goToDesigner()
          else
            this.goToProductListing();
          // this.router.navigateByUrl(this.getUrl("/storedetails/productspreadsheet"));
        } else {
          this.commonService.openErrorSnackBar(response.message, "");
        }
      },
      (error) => {
        this.commonService.toggleLoading(false)
        this.commonService.openErrorSnackBar(
          "Please enter all the field values",
          ""
        );
      }
    );

    // this.router.navigateByUrl('storebuilder/productselection');
  }

  removeProduct(index) {
    this.garmentsRequested.removeAt(index);
    this.productColorArray.splice(index, 1);
    this.productLocationArray.splice(index, 1);
    this.selectedLocationArray.splice(index, 1);
    this.personalizationTypeArray.splice(index, 1);
    this.selectedPersonalizationTypeArray.splice(index, 1);
  }

  addArtMapping(control, garment) {
    control.push(
      this.createArtAssignmentForm(
        garment.value.productId,
        control.value[0].serviceId,
        null,
        garment.value.mapCode
      )
    );
  }

  removeArtMapping(control, i, j) {
    control.removeAt(j);
    this.selectedLocationArray[i].splice(j, 1);
  }

  addPersonalization(control) {
    control.push(this.createPersonalizationForm());
  }

  removepersonalization(control, i, j) {
    control.removeAt(j);
    this.selectedLocationArray[i].splice(j, 1);
    this.selectedPersonalizationTypeArray[i].splice(j, 1);
  }

  toggleProductList(id) {
    // this.getProduct(id);
    this.getProductsByCategoryId(id);
  }

  closeArtModal() {
    this.imageUrl = "";
    $("#addArtModal").modal("hide");
  }

  ///////////////////////////////

  openAddColorModal(artMap, j, garment, artMapping, index) {
    this.selectedArtColors = new FormControl([]);
    this.getDecoPricing(artMap, j, garment, artMapping, index);
    this.selectedInkColorArray = this.getInkColors(index - 1, j);
    this.selectedArtMap = artMap;
    let colors = artMap.get("colors").value
    if (colors) {
      let result = this.selectedInkColorArray.filter(color => colors.indexOf(color.name) >= 0)
      // let result = this.colorArray.filter(function (e) {
      //   return this.indexOf(e.name) >= 0;
      // }, artMap.get("colors").value);
      this.selectedArtColors.setValue(result);
      this.previousColorSelectValues = this.selectedArtColors.value;
    }
    $("#addColorModal").modal("show");
  }

  onArtColorRemoved(topping: string) {
    const toppings = this.selectedArtColors.value as string[];
    this.removeFirst(toppings, topping);
    this.selectedArtColors.setValue(toppings); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  updateArtColor() {
    let colorCount = this.selectedArtMap.get("noOfColors").value;
    let result = this.selectedArtColors.value.map((a) => a.name);
    let resultString = stringify(result);
    if (colorCount == result.length) {
      this.selectedArtMap.patchValue({
        colors: resultString.substring(1, resultString.length - 1),
      });
      $("#addColorModal").modal("hide");
      this.selectedArtColors = new FormControl([]);
    } else {
      this.commonService.openErrorSnackBar(
        "Number of selected colors does not match the actual color count ",
        ""
      );
    }
  }

  uploadArt(files) {
    const formData = new FormData();
    formData.append("file", files.item(0));

    this.storeService.uploadArt(formData).subscribe(
      (response) => {
        this.artArray.push({ src: response.data, artId: 0 });
      },
      (error) => { }
    );
  }

  getDecoServices(i, j) {
    let locationId =
      this.storeRequestForm
        .get("garmentsRequested")
      ["controls"][i].get("artMapping").controls[j].value.positionId || null;
    let decoGrp;
    if (
      locationId &&
      this.productLocationArray[i] &&
      this.productLocationArray[i].length
    )
      decoGrp = this.productLocationArray[i].find(
        (loc) => loc.id == locationId
      );
    return decoGrp ? decoGrp.services : [];
  }

  getAllServiceWithPrice() {
    this.sharedService.getAllServiceWithPrice().subscribe((res: any) => {
      this.servicePriceList = res.data;
    });
  }

  onColorSelectionChange(event) {
    if (event.value.length == this.selectedArtMap.value.noOfColors) {
      this.previousColorSelectValues = this.selectedArtColors.value;
      this.colorSelect.close();
    } else if (event.value.length > this.selectedArtMap.value.noOfColors) {
      this.selectedArtColors.setValue(this.previousColorSelectValues);
      this.commonService.openErrorSnackBar(
        "Number of selected colors is more than actual color count, remove unwanted colors and try again",
        ""
      );
      this.colorSelect.close();
    } else {
      this.previousColorSelectValues = this.selectedArtColors.value;
    }
  }

  validateIndividualProductProperties(garmentRequested) {
    // this.isDiscounted = false;
    for (let i = 0; i < garmentRequested.length; i++) {
      // if (garmentRequested[i].discount && garmentRequested[i].discount > 0 && garmentRequested[i].discountStatus == 0)
      // this.isDiscounted = true;
      let artMapping = garmentRequested[i].artMapping;
      if (!artMapping) return false;
      for (let j = 0; j < artMapping.length; j++) {
        const colors =
          artMapping[j].colors.length > 1
            ? artMapping[j].colors.split(",")
            : null;
        if (!colors || artMapping[j].noOfColors != colors.length) {
          this.commonService.openErrorSnackBar(
            "Color count doesn't match selected colors for " +
            garmentRequested[i].displayName,
            ""
          );
          return false;
        }
        if (!artMapping[j].serviceId) {
          this.commonService.openErrorSnackBar(
            "Select service for " +
            garmentRequested[i].displayName,
            ""
          );
          return false;
        }
        if (!artMapping[j].positionId) {
          this.commonService.openErrorSnackBar(
            "Select position for " +
            garmentRequested[i].displayName,
            ""
          );
          return false;
        }
        if (!artMapping[j].src) {
          this.commonService.openErrorSnackBar(
            "Select art for " +
            garmentRequested[i].displayName,
            ""
          );
          return false;
        }
      }
    }
    return true;
  }

  onGarmentColorChange(colorId, i) {
    let colorObj = this.productColorArray[i].find((el) => el.id == colorId);
    let price = colorObj.sizeVariants[0].storePrice;
    if (!price) {
      price = colorObj.sizeVariants[0].sellingPrice;
      price = price >= 20 ? price + 2 : price + 1;
    }
    // let price = this.productColorArray[i].find((el) => el.id == colorId).price;
    this.garmentsRequested.controls[i].get("price").setValue(price);
    let artMapping =
      this.garmentsRequested.controls[i].get("artMapping")["controls"];
    artMapping.forEach((element: FormGroup) => {
      element.patchValue({ color: colorId });
    });
  }

  designProduct(i) {
    localStorage.setItem("builderDesignedProductIndex", i);
    this.createStore("design")
  }

  goToDesigner() {
    let i = Number(localStorage.getItem("builderDesignedProductIndex"))
    let designData = [];
    this.garmentsRequested.controls[i].value.artMapping.forEach((el, j) => {
      let position = this.getPositionById(el.positionId, i).name;
      let service = this.getDecoServices(i, j).find(
        (ser) => ser.id == el.serviceId
      ).name;
      designData.push({
        image: el.src,
        position,
        colors: el.colors,
        service,
      });
    });
    localStorage.setItem("designData", JSON.stringify(designData));
    let { productId, color } = this.garmentsRequested.controls[i].value;
    // let url = "/designer/" + productId + "-" + color

    let baseUrl = this.router.url;
    let url = this.commonService.createUrl(
      baseUrl,
      "/designer/" + productId + "-" + color,
      1
    );
    this.router.navigateByUrl(url);
  }

  // goToDesigner(){
  // let baseUrl = this.router.url;
  // let url = this.commonService.createUrl(
  //   baseUrl,
  //   "/designer/" + productId + "-" + color,
  //   1
  // );
  // this.router.navigateByUrl(url);
  // }

  goToProductListing() {
    let baseUrl = this.router.url;
    let url = this.commonService.createUrl(
      baseUrl,
      "/storedetails/productspreadsheet",
      1
    );
    this.router.navigateByUrl(url);
  }

  getUrl(url) {
    let baseUrl = this.router.url;
    url = this.commonService.createUrl(
      baseUrl,
      url,
      1
    );
    return url
  }

  getPositionById(id, i) {
    return this.productLocationArray[i].find((el) => el.id == id);
  }

  isDesigned(i) {
    const isDesigned =
      this.storeRequestForm.get("garmentsRequested")["controls"][i].value
        .isDesigned;
    return isDesigned;
  }

  private _filter(value: string): string[] {
    const filterValue =
      value && typeof value == "string" ? value.toLowerCase() : "";
    if (filterValue)
      return this.productList.filter((product) =>
        (
          product.name.toLowerCase() +
          " / / " +
          (product.styleName || "")
        ).includes(filterValue)
      );
    else return this.productList;
  }

  getProductsByCategoryId(categoryId) {
    this.productService
      .getProducts({
        filter: { categories: categoryId, viewType: 1, storeStatuses: "1,3" },
        per_page: 0,
      })
      .subscribe((response) => {
        this.productList = response.body.data;
        this.updateFilterOptions();
      });
  }

  // --------------------------------------------------------------------

  getVendorList() {
    this.productService.getVendors().subscribe((res) => {
      this.vendorList = res.body.data;
    });
  }

  getProductCategories() {
    this.productService.getProductCategory().subscribe((response) => {
      this.categoryList = response.body.data;
    });
  }

  pageEvent(event) {
    this.paginator.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex + 1;
    this.getProducts();
  }

  getProducts() {
    const filter: any = this.formatFilterParams();
    const params = {
      per_page: this.paginator.pageSize,
      page: this.paginator.pageIndex,
      filter,
    };
    this.productService.getProducts(params).subscribe((response) => {
      this.productList = response.body.data;
      this.paginator.length =
        JSON.parse(response.headers.get("Pagination")).totalItems || 0;
    });
  }

  formatFilterParams() {
    let formattedParams = {
      name: this.filterParams.filterText,
      styleName: this.filterParams.styleName,
      storeStatuses: "1,3",
      active:1,
    };
    formattedParams["colors"] = this.filterParams.colors.toString();
    formattedParams["categories"] = this.filterParams.categories.toString();
    formattedParams["sizes"] = this.filterParams.sizes.toString();
    formattedParams["brands"] = this.filterParams.brands.toString();
    formattedParams["vendorName"] = this.filterParams.vendorName.toString();

    return formattedParams;
  }

  clearFilter() {
    this.filterParams = {
      minPrice: 0,
      maxPrice: 500,
      name: "",
      styleName: "",
      colors: [],
      categories: [],
      sizes: [],
      brands: [],
      vendorName: [],
      filterText: "",
    };
    this.getProducts();
  }

  getInkColors(i, j) {
    let serviceId =
      this.storeRequestForm
        .get("garmentsRequested")
      ["controls"][i].get("artMapping").controls[j].value.serviceId || null;
    return this.inkColorArray.find((obj) => obj.serviceId == serviceId).colors;
  }

  getPersonalizationInkColors(i, j) {
    let personalization: FormGroup = this.storeRequestForm
      .get("garmentsRequested")
    ["controls"][i].get("teamStoreGarmentPersonalizations").controls[j];
    let serviceId = personalization.value.personalizedServiceId || null;
    let color = this.inkColorArray.find(
      (obj) => obj.serviceId == serviceId
    )
    let arr = color ? color.colors : [];
    this.inkColors[i] = this.inkColors[i] ? this.inkColors[i] : [];
    this.inkColors[i][j] = arr;
    personalization.get("personalizedColorId").updateValueAndValidity();
    return arr;
  }

  setAllPersonalizationInkColors() {
    this.storeRequestForm
      .get("garmentsRequested")
    ["controls"].forEach((control: FormGroup, i) => {
      control
        .get("teamStoreGarmentPersonalizations")
      ["controls"].forEach((personalization: FormGroup, j) => {
        this.getPersonalizationInkColors(i, j);
      });
    });
  }

  openProductList() {
    if (this.storeRequestForm.value.garmentsRequested.length >= 40) {
      this.commonService.openErrorSnackBar("Maximum number of products allowed is 40", "")
      return
    } else {
      $("#addProductModal2").modal("show");
    }
  }


  getPersonalizationSizes(i, j) {
    let personalization =
      this.storeRequestForm.value.garmentsRequested[i]
        .teamStoreGarmentPersonalizations[j];
    if (personalization.personalizedServiceId)
      var service = this.personalizationServicesWithFontSize.find(
        (obj) => obj.id == personalization.personalizedServiceId
      );
    if (service && personalization.personalizedTypeId)
      var type = service.personalizationTypes.find(
        (obj) => obj.id == personalization.personalizedTypeId
      );
    if (type && type.sizes) return type.sizes;
    return [];
  }

  getPersonalizationFonts(i, j) {
    let personalization =
      this.storeRequestForm.value.garmentsRequested[i]
        .teamStoreGarmentPersonalizations[j];
    if (personalization.personalizedServiceId)
      var service = this.personalizationServicesWithFontSize.find(
        (obj) => obj.id == personalization.personalizedServiceId
      );
    if (service && personalization.personalizedTypeId)
      var type = service.personalizationTypes.find(
        (obj) => obj.id == personalization.personalizedTypeId
      );
    if (type && type.fonts) return type.fonts;
    return [];
  }


  personalizationPositionChange(itemId, i, j) {
    this.selectedLocationArray[i][j + 5] = itemId;
  }

  resetPersonalizationPositions(i) {
    this.selectedLocationArray[i].splice(5)
  }

  setPersonalizationInkColors(i, pCount) {
    for (let j = 0; j < pCount; j++) {
      this.getPersonalizationInkColors(i, j)
    }
  }

  onPersonalizationServiceChange(i, j) {
    this.getPersonalizationInkColors(i, j)
    let personalization: FormGroup = this.storeRequestForm
      .get("garmentsRequested")
    ["controls"][i].get("teamStoreGarmentPersonalizations").controls[j];
    // personalization.get('personalizedColorId').reset()
    // personalization.get('personalizedSizeId').reset()
    // personalization.get('personalizedFontId').reset()
  }
}
