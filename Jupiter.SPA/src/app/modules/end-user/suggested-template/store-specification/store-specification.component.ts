import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
import { stringify } from '@angular/compiler/src/util';
import { SharedService } from 'src/app/core/services/shared.service';
declare var componentHandler: any;
declare var $: any;
import Swal from 'sweetalert2'

@Component({
  selector: 'app-store-specification',
  templateUrl: './store-specification.component.html',
  styleUrls: ['./store-specification.component.scss']
})
export class StoreSpecificationComponent implements OnInit {
  @ViewChild('colorSelect', null) colorSelect;
  previousColorSelectValues = []
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
  artArray: any[] = []
  imageUrl: any;
  dataSource: any;
  teamStoreObj: any[];
  isShowDiv: boolean;
  user: any;
  color: String = 'red';
  colorArray: any[] = [];
  selectedColorArray: any[] = [];
  public productFormControl: FormControl;
  filteredProductList: Observable<any[]>;
  position: any = true;
  fontArray: any[] = [];
  serviceArray: any[] = [];
  personalizationServiceArray: any[] = [];
  sizeArray: any;
  positionArray: any;
  productColorArray: any[] = [];
  productLocationArray: any[] = [];
  selectedLocationArray: any[] = [];
  personalizationTypeArray: any[] = [];
  selectedPersonalizationTypeArray: any[] = [];
  personalizationTypes: any;
  totalPersonalizationCost: any = 0;
  selectedArtColors = new FormControl([]);
  selectedArtMap: FormGroup;
  servicePriceList = []
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private storeBuilderService: StorebuilderService,
    private storeService: StoreService,
    private productService: ProductService,
    private router: Router,
    private commonService: CommonService,
    private sharedService: SharedService,) {
    this.productFormControl = new FormControl();
  }

  ngOnInit() {
    this.createStoreSpecificationForm();
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.getPersonalizationTypes();
    this.getTeamStore(this.teamStoreId);
    this.getProductCategory();
    this.getAvailableStoreColors();
    this.getAvailableStoreServices();
    this.getAvailableStoreFonts();
    this.getAvailableStoreProductPositions();
    this.getAvailableProductSizes();
    this.user = parseInt(localStorage.getItem("user"));
    this.getAllServiceWithPrice()
  }


  updateFilterOptions() {
    this.filteredProductList = this.productFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }


  getProductById(id) {
    this.productService.getProductDetail(id).subscribe(res => {
      this.productSelected(res.products);
    })
  }
  
  productSelection(event) {
    let productId = event.option.value.split(" - ")[0]
    this.getProductById(productId)
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
      customerNotes: new FormControl(''),
      selectedArts: [],
    });
  }


  createProductForm(): FormGroup {
    return this.formBuilder.group({
      productId: 0,
      teamStoreId: this.teamStoreId,
      personalize: false,
      sku: [''],
      productName: [''],
      displayName: [''],
      color: [''],
      price: [],
      discount: 0,
      fundraiserAmount: [0],
      fundraiserPercentage: [0],
      decoPrice: [],
      total: [],
      artMapping: this.formBuilder.array([]),
      teamStoreGarmentPersonalizations: this.formBuilder.array([])
    });
  }

  addProduct(productDetail): FormGroup {
    let price = Math.ceil(Number(productDetail.price))
    price = price >= 20 ? price + 2 : price + 1
    return this.formBuilder.group({
      productId: productDetail.id,
      teamStoreId: this.teamStoreId,
      personalize: false,
      sku: productDetail.sku,
      productName: productDetail.name,
      displayName: productDetail.name,
      color: [''],
      price: price.toFixed(2),
      discount: 0,
      fundraiserAmount: [0],
      fundraiserPercentage: [0],
      decoPrice: [],
      total: [],
      artMapping: this.formBuilder.array([this.createArtAssignmentForm(productDetail.id, 1)]),
      teamStoreGarmentPersonalizations: this.formBuilder.array([])
    });
  }

  createArtAssignmentForm(productId, serviceId): FormGroup {
    return this.formBuilder.group({
      id: 0,
      src: [''],
      teamStoreId: this.teamStoreId,
      productId: productId,
      positionId: [''],
      serviceId: [serviceId],
      noOfColors: [1],
      colors: [''],
      // primaryColorId: [''],
      // secondaryColorId: [''],
      // tertiaryColorId: [''],
      // threadCount: [0],
      decoPrice: ['']
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
      personalizedCost: 0
    });
  }

  getProductCategory() {
    this.productService.getProductCategory().subscribe(
      (response) => {
        this.categoryList = response.body.data;
        this.getProduct(this.categoryList[0].id);
      },
      (error) => {

      }
    );
  }

  getProduct(categoryId: any) {
    this.productService.getProduct(categoryId).subscribe(
      (response) => {
        this.productList = response.body.data;
        this.updateFilterOptions()
      },
      (error) => {

      }
    );
  }

  getAvailableStoreColors() {
    this.storeService.getAvailableStoreColors().subscribe(
      (response) => {
        this.colorArray = response.data;
      },
      (error) => {

      }
    );
  }

  getAvailableStoreServices() {
    this.storeService.getAvailableStoreServices().subscribe(
      (response) => {
        this.serviceArray = response.data;
        this.personalizationServiceArray = this.serviceArray.filter(function (obj) {
          return obj.id != 1;
        });
      },
      (error) => {

      }
    );
  }
  getAvailableStoreFonts() {
    this.storeService.getAvailableStoreFonts().subscribe(
      (response) => {
        this.fontArray = response.data;
      },
      (error) => {

      }
    );
  }

  getPersonalizationTypes() {
    this.storeService.getPersonalizationTypes().subscribe(
      (response) => {
        this.personalizationTypes = response.data;
      },
      (error) => {

      }
    );
  }

  getAvailableStoreProductPositions() {
    this.storeService.getAvailableStoreProductPositions(0).subscribe(
      (response) => {
        this.positionArray = response;
      },
      (error) => {

      }
    );
  }

  getProductColor(productId, i, setDefault?) {
    this.storeService.getProductColors(productId).subscribe(
      (response) => {
        this.productColorArray[i] = response.data;
        if (setDefault){
          this.garmentsRequested.controls[i].get('color').setValue(this.productColorArray[i][0].id)
          this.onGarmentColorChange(this.productColorArray[i][0].id,i)
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
    this.getDecoPricing(artMap, j, garment, artMapping, index)
  }

  getDecoPricing(artMap, j, garment, artMapping, index) {

    let prevService = []
    for (let i = 0; i < artMapping.controls.length; i++) {
      let serviceId = artMapping.controls[i].get('serviceId').value
      let colorCount = artMapping.controls[i].get('noOfColors').value
      let service = this.servicePriceList.find(s => s.id == serviceId)
      let decoPrice = 0
      if (prevService.includes(serviceId) == false) {
        prevService.push(artMapping.controls[i].value.serviceId)
        decoPrice = service.firstPrice[colorCount - 1]
      } else {
        decoPrice = service.secondPrice[colorCount - 1]
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

  getAvailableProductSizes() {
    this.storeService.getAvailableProductSizes().subscribe(
      (response) => {
        this.sizeArray = response;
      },
      (error) => {

      }
    );
  }

  updatePersonalize(event, control, i) {
    if (event.checked)
      this.addPersonalization(control);
    else
      control.clear();
    // this.removepersonalization(control, i, 0)
  }

  storeListColumns: string[] = ['storeName', 'storeOwner', 'orderNumber', 'accountManager', 'assignedTo'];

  setArtAssignmentForm(art) {
    return this.formBuilder.group({
      id: art.id,
      src: art.src,
      teamStoreId: art.teamStoreId,
      productId: art.productId,
      positionId: art.positionId,
      serviceId: art.serviceId,
      noOfColors: art.noOfColors,
      colors: art.colors,
      // primaryColorId: art.primaryColorId,
      // secondaryColorId: art.secondaryColorId,
      // tertiaryColorId: art.tertiaryColorId,
      // threadCount: art.threadCount,
      decoPrice: Number(art.decoPrice).toFixed(2)
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
      personalizedCost: personalization.personalizedCost
    });
  }

  setGarmentsForm(productDetail, artsRequested, personalizations, index): FormGroup {
    var form = this.formBuilder.group({
      productId: productDetail.productId,
      teamStoreId: this.teamStoreId,
      personalize: productDetail.personalize,
      sku: 0,
      productName: productDetail.productName,
      displayName: productDetail.productName,
      color: productDetail.color,
      price: Number(productDetail.price).toFixed(2),
      discount: 0,
      fundraiserAmount: Number(productDetail.fundraiserAmount).toFixed(2),
      fundraiserPercentage: productDetail.fundraiserPercentage,
      decoPrice: Number(productDetail.decoPrice).toFixed(2),
      total: Number(productDetail.total).toFixed(2),
      artMapping: this.formBuilder.array([]),
      teamStoreGarmentPersonalizations: this.formBuilder.array([])
    });

    this.selectedLocationArray.push([]);
    this.artMapping = form.get('artMapping') as FormArray;
    if (artsRequested.length > 0) {
      for (var i = 0; i < artsRequested.length; i++) {
        if (productDetail.productId == artsRequested[i].productId) {
          this.artMapping.push(this.setArtAssignmentForm(artsRequested[i]));
          this.selectedLocationArray[index].push(artsRequested[i].positionId);
        }
      };
    } else {
      this.artMapping.push(this.createArtAssignmentForm(productDetail.productId, 1));
    }

    this.selectedPersonalizationTypeArray.push([]);
    this.teamStoreGarmentPersonalizations = form.get('teamStoreGarmentPersonalizations') as FormArray;
    for (var i = 0; i < personalizations.length; i++) {
      this.teamStoreGarmentPersonalizations.push(this.setPersonalizationForm(personalizations[i]));
      this.selectedPersonalizationTypeArray[index].push(personalizations[i].personalizedTypeId);
    };

    return form;
  }

  createArtArray(artRequested) {
    var flags = [], output = [], l = artRequested.length, i;
    for (i = 0; i < l; i++) {
      if (flags[artRequested[i].src]) continue;
      flags[artRequested[i].src] = true;
      output.push(artRequested[i].src);
    }
    return output;
  }

  getTeamStore(teamStoreId) {
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe(response => {
      var teamStore = response.data;
      // this.artArray = this.createArtArray(teamStore.selectedArts)
      this.storeRequestForm.setValue({
        id: teamStore.id,
        garmentsRequested: [],
        artsRequested: teamStore.artsRequested,
        customerNotes: teamStore.customerNotes,
        selectedArts: teamStore.selectedArts || [],
      });
      this.garmentsRequested = this.storeRequestForm.get('garmentsRequested') as FormArray;
      this.artArray = teamStore.selectedArts || []
      for (var i = 0; i < teamStore.garmentsRequested.length; i++) {
        this.garmentsRequested.push(this.setGarmentsForm(teamStore.garmentsRequested[i], teamStore.artsRequested, teamStore.garmentsRequested[i].teamStoreGarmentPersonalizations, i));
        this.getProductColor(teamStore.garmentsRequested[i].productId, i);
        this.getProductLocations(teamStore.garmentsRequested[i].productId, i);
        this.selectedPersonalizationType(i);
      };
      this.teamStoreObj = [
        { storeName: teamStore.name, storeOwner: teamStore.contactName, orderNumber: teamStore.id, accountManager: teamStore.createdBy.name, assignedTo: teamStore.assignedTo }
      ];
      this.dataSource = this.teamStoreObj;
    },
      error => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
  }

  updateComponents() {
    setTimeout(function () { componentHandler.upgradeAllRegistered(); }, 10);
  }

  productSelected(productDetail) {
    let productList = this.storeRequestForm.get('garmentsRequested').value;
    const found = productList.some(el => el.productId === productDetail.id);
    $('#addProductModal').modal('hide');
    if (found) {
      Swal.fire({
        html: '<p>This product is already selected</p>',
        icon: 'info',
        confirmButtonText: 'Add again',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        reverseButtons: true,
      }).then(result => {
        if (result.isConfirmed) {
          this.garmentsRequested = this.storeRequestForm.get('garmentsRequested') as FormArray;
      this.garmentsRequested.push(this.addProduct(productDetail));
      this.getProductColor(productDetail.id, productList.length, true);
      this.getProductLocations(productDetail.id, productList.length);
      this.selectedPersonalizationType(productList.length);
        }
      })
      
    } else {
      this.garmentsRequested = this.storeRequestForm.get('garmentsRequested') as FormArray;
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
    let fundraiserAmount = Number(this.getProductfundraisingAmount(price, fundraiserPercentage)) || 0;
    let decoPrice = Number(garment.value.decoPrice) || 0;
    let total = price + fundraiserAmount + decoPrice + this.totalPersonalizationCost;
    garment.patchValue({
      total: Number(total).toFixed(2),
      fundraiserAmount: fundraiserAmount
    });
  }

  getProductfundraisingPercentage(garment) {
    let price = garment.value.price;
    let fundraiserAmount = garment.value.fundraiserAmount;
    let fundraiserPercentage = parseFloat((fundraiserAmount * 100 / price).toFixed(2));
    garment.patchValue({
      fundraiserPercentage: fundraiserPercentage
    });
    this.getTotal(garment);
  }

  calculateDecoPricing(garment, artMapping) {
    let totalDecoPricing = 0;
    for (let i = 0; i < artMapping.controls.length; i++) {
      totalDecoPricing += parseInt(artMapping.controls[i].value.decoPrice);
    }
    garment.patchValue({
      decoPrice: Number(totalDecoPricing).toFixed(2)
    });
    this.getTotal(garment);
  }

  personalizationTypeSelected(index, personalize, j, garment, personalization) {
    this.selectedPersonalizationTypeArray[index][j] = personalize.controls.personalizedTypeId.value;
    let cost = this.personalizationTypes.find(x => x.id == personalize.controls.personalizedTypeId.value).cost;
    personalize.patchValue({ personalizedCost: cost });

    this.totalPersonalizationCost = 0;
    for (let i = 0; i < personalization.controls.length; i++) {
      this.totalPersonalizationCost += personalization.controls[i].value.personalizedCost;
    }
    this.getTotal(garment);
  }

  getProductfundraisingAmount(price, fundraiserPercentage) {
    let fundraiserAmount;
    fundraiserAmount = parseFloat((price * fundraiserPercentage / 100).toFixed(2));
    return fundraiserAmount;
  }

  addImageLink() {
    if (this.imageUrl && this.imageUrl.trim().length > 6) {
      this.artArray.push({ src: this.imageUrl, artId: 0 });
      this.closeArtModal();
    } else {
      this.commonService.openWarningSnackBar('Please enter a valid URL', '');
    }
  }

  removeArt(removalIndex) {
    this.artArray.splice(removalIndex, 1);
  }

  createArtRequested(garmentsArray) {
    let artArray = [];
    garmentsArray.garmentsRequested.forEach(garment => {
      garment.artMapping.forEach(art => {
        artArray.push(art);
      });
    });
    return artArray;
  }

  createStore() {
    let garmentArray = this.storeRequestForm.value;
    if (this.artArray.length != 0) {
      if (garmentArray.garmentsRequested != null && garmentArray.garmentsRequested.length != 0) {
        if (this.validateColorAndCount(garmentArray.garmentsRequested)) {
          this.storeRequestForm.controls['artsRequested'].setValue(this.createArtRequested(this.storeRequestForm.value));
          this.storeRequestForm.controls['selectedArts'].setValue(this.artArray)
        }
      }
      else {
        this.commonService.openErrorSnackBar("Please add atleast one product", "");
        return;
      }
    }
    else {
      this.commonService.openErrorSnackBar("Please add atleast one art", "");
      return;
    }

    this.storeService.updateStore(this.storeRequestForm.value).subscribe(
      (response) => {
        if (response.status == 1) {
          this.commonService.openSuccessSnackBar(response.message, "");
          // this.router.navigateByUrl('enduser/buildownstore/productselection');
          let data = { replaceHome: true };
          window.parent.postMessage(data, "*");

        } else {
          this.commonService.openErrorSnackBar(response.message, "");
        }
      },
      (error) => {
        this.commonService.openErrorSnackBar("Please enter all the field values", "");
      }
    );

  }

  removeProduct(index) {
    this.garmentsRequested.removeAt(index);
    this.productColorArray.splice(index, 1);;
    this.productLocationArray.splice(index, 1);
    this.selectedLocationArray.splice(index, 1);
    this.personalizationTypeArray.splice(index, 1);
    this.selectedPersonalizationTypeArray.splice(index, 1);
  }

  addArtMapping(control, garment) {
    control.push(this.createArtAssignmentForm(garment.value.productId, control.value[0].serviceId));
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
    this.selectedPersonalizationTypeArray[i].splice(j, 1);
  }

  toggleProductList(id) {
    this.getProductsByCategoryId(id);
  }

  getProductsByCategoryId(categoryId) {
    this.productService.getProducts({ filter: { categories: categoryId }, per_page: 0 }).subscribe(
      (response) => {
        this.productList = response.body.data;
        this.updateFilterOptions();
      },

    );
  }

  openArtModal() {
    $('#addArtModal').modal('show');
    $('#addArtModal').on('show.bs.modal', function (e) {
      if (window.top.document.querySelector('iframe')) {
        $('#addArtModal').css('top', window.top.scrollY); //set modal position
      }
    });
  }

  closeArtModal() {
    this.imageUrl = "";
    $('#addArtModal').modal('hide');
  }

  ///////////////////////////////

  openAddColorModal(artMap, j, garment, artMapping, index) {
    this.selectedArtColors = new FormControl([]);
    this.getDecoPricing(artMap, j, garment, artMapping, index)
    this.selectedArtMap = artMap;
    if (artMap.get('colors').value != null) {
      let result = this.colorArray.filter(
        function (e) {
          return this.indexOf(e.name) >= 0;
        },
        artMap.get('colors').value
      );
      this.selectedArtColors.setValue(result)
      this.previousColorSelectValues = this.selectedArtColors.value
    }
    $('#addColorModal').modal('show');
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
    let colorCount = this.selectedArtMap.get('noOfColors').value;
    let result = this.selectedArtColors.value.map(a => a.name);
    let resultString = stringify(result);
    if (colorCount == result.length) {
      this.selectedArtMap.patchValue({ colors: resultString.substring(1, resultString.length - 1) });
      $('#addColorModal').modal('hide');
      this.selectedArtColors = new FormControl([]);
    } else {
      this.commonService.openErrorSnackBar("Number of selected colors does not match the actual color count ", "");
    }
  }

  uploadArt(files) {

    const formData = new FormData();
    formData.append("file", files.item(0));


    this.storeService.uploadArt(formData).subscribe(
      (response) => {
        this.artArray.push({ src: response.data, artId: 0 });
      },
      (error) => {

      }
    );

  }

  getDecoServices(i, j) {
    let locationId = this.storeRequestForm.get('garmentsRequested')['controls'][i].get('artMapping').controls[j].value.positionId || null
    let decoGrp
    if (locationId && this.productLocationArray[i] && this.productLocationArray[i].length)
      decoGrp = this.productLocationArray[i].find(loc => loc.id == locationId)
    return decoGrp ? decoGrp.services : []
  }

  getAllServiceWithPrice() {
    this.sharedService.getAllServiceWithPrice().subscribe((res: any) => {
      this.servicePriceList = res.data
    })
  }

  onColorSelectionChange(event) {
    if (event.value.length == this.selectedArtMap.value.noOfColors) {
      this.previousColorSelectValues = this.selectedArtColors.value
      this.colorSelect.close()
    } else if (event.value.length > this.selectedArtMap.value.noOfColors) {
      this.selectedArtColors.setValue(this.previousColorSelectValues)
      this.commonService.openErrorSnackBar("Number of selected colors is more than actual color count, remove unwanted colors and try again", "");
      this.colorSelect.close()
    } else {
      this.previousColorSelectValues = this.selectedArtColors.value
    }
  }

  validateColorAndCount(garmentRequested) {
    for (let i = 0; i < garmentRequested.length; i++) {
      let artMapping = garmentRequested[i].artMapping
      if (!artMapping)
        return false
      for (let j = 0; j < artMapping.length; j++) {
        const colors = artMapping[j].colors.length > 1 ? artMapping[j].colors.split(',') : null
        if (!colors || artMapping[j].noOfColors != colors.length) {
          this.commonService.openErrorSnackBar("Color count doesn't match selected colors for " + garmentRequested[i].productName, "")
          return false
        }
      }
    }
    return true
  }
  
  onGarmentColorChange(colorId, i) {
    let price = this.productColorArray[i].find(el => el.id == colorId).price
    this.garmentsRequested.controls[i].get("price").setValue(price)
  }

  private _filter(value: string): string[] {
    const filterValue = value && typeof (value) == 'string' ? value.toLowerCase() : ''
    if (filterValue)
      return this.productList.filter(product => product.name.toLowerCase().includes(filterValue));
    else
      return this.productList
  }
}

