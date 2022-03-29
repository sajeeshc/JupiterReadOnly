
import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { EnduserService } from 'src/app/core/services/enduser.service';
import { ProductService } from 'src/app/core/services/product.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { StoreService } from 'src/app/core/services/store.service';
import { UserService } from 'src/app/core/services/user.service';

declare var $: any;
import Swal from 'sweetalert2'
let moment = require('moment')

@Component({
  selector: 'app-bulk-order-entry',
  templateUrl: './bulk-order-entry.component.html',
  styleUrls: ['./bulk-order-entry.component.scss']
})


export class BulkOrderEntryComponent implements OnInit {

  customerEmail: string
  organizationArray = []
  userInfo: FormGroup
  productList = []
  orderLineItemsGrid: FormArray = this.formBuilder.array([])
  sizesArray = []
  updateBillingAddressForm: FormGroup
  updateShippingAddressForm: FormGroup
  organizationForm: FormGroup;
  selectedOrganization: any = -1
  institutionTypeArray = []
  states: any[] = []
  serviceArray = []
  positionArray = []
  orderPlacedDate = moment()
  reqShipDate = moment().add(10, 'days')
  refId = ''
  orderNotes = ''
  cartItemNotes: FormGroup
  action = -1
  cardInfo: FormGroup
  cardExpYears = []
  availableCards = {
    AE: { prefix: [34, 37], length: 15 },
    V: { prefix: [4], length: 16 },
    MC: { prefix: [51, 52, 53, 54, 55], length: 16 },
    D: { prefix: [6011, 5], length: 16 },
    DC: { prefix: [300, 301, 302, 303, 304, 305, 36, 38], length: 14 },
    JCB: { prefix: [2131, 1800, 35], length: 16 },
  }
  selectedShippingMethod
  shippingMethods: any = [
    {
      'id': 1,
      'name': 'Overnight',
      'price': 20
    },
    {
      'id': 2,
      'name': 'Second tier',
      'price': 10
    }
  ]
  freeShipping = {
    'id': 3,
    'name': 'Free shipping',
    'price': 0
  }
  backFromDesigner = false
  bulkOrderEntryDesignIndex = -1


  constructor(
    private endUserService: EnduserService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private userService: UserService,
    private productService: ProductService,
    private sharedService: SharedService,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  @HostListener('window:beforeunload', ['$event'])
  confirmReload($event) {
    return false;
  }

  ngOnInit() {
    this.backFromDesigner = localStorage.getItem('bulkOrderEntry') ? true : false
    this.refId = this.route.snapshot.queryParams['ref'] || ''
    this.initUserInfo()
    this.getProducts()
    this.createAddressForm()
    this.getStates()
    this.initializeOrganizationForm()
    this.getInstitutionTypes()
    this.getAvailableStoreServices()
    this.initializeCartItemNotes()
    this.initializeCardInfo()
    // window.addEventListener("popstate", function (event) { return false })
  }

  initializeCartItemNotes() {
    this.cartItemNotes = this.formBuilder.group({
      productNotes: '',
      designNotes: '',
      i: null
    })
  }

  initializeOrderLineItem() {
    if (this.refId) {
      this.storeService.getBulkOrderEntryByRefId(this.refId).subscribe(res => {
        this.getUser(res.data[0].user.id)
        this.setBulkOrderEntryData(res.data)
      })
    } else if (this.backFromDesigner) {
      const data = JSON.parse(localStorage.getItem('bulkOrderEntry'))
      const userId = localStorage.getItem('bulkOrderEntryUserId')
      this.getUser(userId)
      this.setBulkOrderEntryData(data)
      this.setDesignerId()
    } else {
      this.addNewOrderLineItem()
    }
  }

  setBulkOrderEntryData(data) {
    data.forEach((element, i) => {
      if (this.backFromDesigner)
        element["productName"] = element.productName
      else
        element["productName"] = element.productName + " - " + element.productId
      // element["colorId"] = element.cartItemGrids[0].colorId || 0
      this.selectedOrganization = element.organizationId || 0
      element["organizationId"] = element.organizationId || 0
      // element["customerId"] = element.customerId || 0
      element["orderNotes"] = element.orderNotes || ''
      this.orderNotes = element.orderNotes || ''
      //  loop and create each cart item grid separately and group them then replace cartItemGrid ("INEFFICIENT")
      let arr = this.formBuilder.array([])
      element.cartItemGrids.forEach(element => {
        let grp = this.formBuilder.group({
          size: element.size,
          quantity: element.quantity,
          personalize: element.personalize,
          isAvailable: false
        })
        arr.push(grp)
      });
      element["cartItemGrids"] = arr
      this.orderLineItemsGrid.push(this.formBuilder.group(element))
      this.enableSize(i)
      this.onQuantityChange(i)
      this.updateTotalPrice(i)
      // if (this.backFromDesigner)
      //   this.saveAsDraft()
    });
  }

  setDesignerId() {
    const designerId = this.refId = this.route.snapshot.queryParams['designerId'] || ''
    if (designerId) {
      const index = Number(localStorage.getItem('bulkOrderEntryDesignIndex'))
      if (index != NaN) {
        let existingDesignerId = false
        for (let control of this.orderLineItemsGrid.controls) {
          if (control.get('designerCartId').value == designerId) {
            existingDesignerId = true
            break
          }
        }
        if (!existingDesignerId) {
          this.orderLineItemsGrid.controls[index].get("designerCartId").setValue(designerId)
          this.orderLineItemsGrid.controls[index].get("isDesigned").setValue(true)
          this.orderLineItemsGrid.controls[index].get("purchaseType").setValue(2)
        }
        localStorage.removeItem("bulkOrderEntry")
        localStorage.removeItem("bulkOrderEntryDesignIndex")
        localStorage.removeItem("bulkOrderEntryUserId")
      }
    }
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

  initializeCardInfo() {
    this.cardInfo = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.min(10000000000000), Validators.max(9999999999999999)]],
      expMonth: ['0', [Validators.required, Validators.min(1)]],
      expYear: ['0', [Validators.required, Validators.min(1)]],
      expirationDate: ['', [Validators.required]],
      cardCode: ['', [Validators.required, Validators.minLength(3)]]
    })
    let year = new Date().getFullYear()
    for (let i = 0; i < 15; i++) {
      this.cardExpYears.push(year)
      year++
    }
  }

  initUserInfo(params?) {
    this.userInfo = this.formBuilder.group({
      id: '',
      email: [params ? params.email ? params.email : '' : '', Validators.required],
      phoneNumber: [params ? params.phone ? params.phone : '' : ''],
      firstName: '',
      lastName: '',
      billingAddress: '',
      billingAddress1: '',
      billingCity: '',
      billingZipCode: '',
      billingState: '',
      shippingAddress: '',
      shippingAddress1: '',
      shippingCity: '',
      shippingZipCode: '',
      shippingState: '',
      isSameAsBillingAddress: false,
      password: '000',
      organizationName: ""
    })
  }

  createNewOrderLineItem() {
    const orderLineItem = this.formBuilder.group({
      cartId: 0,
      teamStoreId: null,
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      isPersonalize: false,
      quantity: ['', Validators.min(1)],
      totalPrice: '0.00',
      unitPrice: '0.00',
      discount: [0, Validators.min(0)],
      isDiscountApproved: false,
      purchaseType: 1,
      designerCartId: null,
      colorId: [0, Validators.required],
      cartItemGrids: this.createNewCartItemGridsArray(),
      serviceId: 0,
      positionId: 0,
      personalizeNumber: false,
      personalizeName: false,
      personalizationPrice: 0,
      personalizedQuantity: 0,
      customerId: [this.userInfo.value.id ? this.userInfo.value.id : ''],
      organizationId: -1,
      productNotes: '',
      designNotes: '',
      orderNotes: '',
      isDesigned: false,
      referenceId: this.refId,
      cartType: 1,
    })
    return orderLineItem
  }

  createNewCartItemGridsArray() {
    let array = new FormArray([])
    this.sizesArray.forEach(size => {
      const cartItem = this.formBuilder.group({
        size: size.id,
        quantity: '',
        personalize: false,
        colorId: '',
        color: '',
        isAvailable: false
      })
      array.push(cartItem)
    })
    return array
  }

  createAddressForm() {
    this.updateBillingAddressForm = this.formBuilder.group({
      billingAddress: new FormControl(''),
      billingAddress1: new FormControl(''),
      billingCity: new FormControl(''),
      billingState: new FormControl(-1, Validators.min(0)),
      billingZipCode: new FormControl(''),
      updateProfile: new FormControl(false)
    })
    this.updateShippingAddressForm = this.formBuilder.group({
      shippingAddress: new FormControl(''),
      shippingAddress1: new FormControl(''),
      shippingCity: new FormControl(''),
      shippingState: new FormControl(-1, Validators.min(0)),
      shippingZipCode: new FormControl(''),
      updateProfile: new FormControl(false)
    })
  }

  createNewUser(action) {
    if (this.userInfo.valid) {
      if (this.validateEmail(this.userInfo.value.email)) {
        const userOrg = this.getOrganizationById(this.selectedOrganization)
        this.userInfo.get("organizationName").setValue(userOrg ? userOrg.name : '')
        this.userInfo.value["organizationList"] = this.organizationArray
        this.userService.createUser(this.userInfo.value).subscribe(res => {
          this.userInfo = this.formBuilder.group(res.data)
          this.setUserId()
          if (action == 1) {
            // this.payNow()
            this.openOrderNotes(action)
          } else if (action == 2) {
            // this.submitQuote()
            this.openOrderNotes(action)
          } else if (action == 3) {
            this.saveAsDraft()
          } else if (action == 4) {
            this.openDesigner(this.bulkOrderEntryDesignIndex)
          }
        }, err => {
          this.commonService.openErrorSnackBar("Unable to create user", "")
        })
      } else {
        this.commonService.openErrorSnackBar("Please enter a valid email to continue", "")
      }
    } else {
      this.commonService.openErrorSnackBar("Please enter a valid email to create user", "")
    }
  }

  createOrganization() {
    if (this.organizationForm.valid) {
      this.organizationArray.push(this.organizationForm.value)
      this.selectedOrganization = this.organizationForm.value.id
      if (this.userInfo.value.id) {

      }
      // this.endUserService.createOrganization(this.organizationForm.value).subscribe(response => {
      //   if (response.statusCode == 200) {
      //     this.commonService.openSuccessSnackBar(response.message, "")
      //     this.allOrganizations.push(response.data);
      //     this.filteredOrganizations = this.orgNameFormControl.valueChanges
      //       .pipe(
      //         startWith(''),
      //         map(value => this._filter(value))
      //       )
      //     // this.organizationSelected(response.data)
      //     this.initializeOrganizationForm()
      //   }
      // })
      this.closeOrganizationModal()
    } else {
      document.getElementById("organizationForm").classList.add("was-validated")
      this.commonService.openErrorSnackBar("Fill all required fields", "")
    }
  }

  getProducts() {
    this.productService.getProduct({}).subscribe(
      (response) => {
        this.productList = response.body.data;
        this.getSizes()
      },
      (error) => {
        console.log(error)
      }
    );
  }

  getSizes() {
    this.productService.getAllAvailableSizes().subscribe(response => {
      this.sizesArray = response.sizes
      this.initializeOrderLineItem()
    })
  }

  getStates() {
    this.sharedService.getAllStates().subscribe(res => {
      this.states = res.data
    })
  }

  getInstitutionTypes() {
    this.sharedService.getInstituitionTypes().subscribe(response => {
      if (response.data != null) {
        this.institutionTypeArray = response.data;
      }
    });
  }

  getAvailableStoreServices() {
    this.storeService.getAvailableStoreServices().subscribe(
      (response) => {
        this.serviceArray = response.data;
        // this.personalizationServiceArray = this.serviceArray.filter(function (obj) {
        //   return obj.id != 1;
        // });
      },
      (error) => {

      }
    );
  }

  addNewOrderLineItem() {
    this.orderLineItemsGrid.push(
      this.createNewOrderLineItem()
    )
  }

  removeOrderLineItem(i) {
    if (this.orderLineItemsGrid.controls.length > 1) {
      this.orderLineItemsGrid.removeAt(i)
    } else {
      this.orderLineItemsGrid.removeAt(i)
      this.addNewOrderLineItem()
    }
  }

  checkUserByEmail() {
    let email = this.userInfo.value.email;
    if (this.validateEmail(email)) {
      this.endUserService.getUserInfoUsingEmaiId(email).subscribe(response => {
        if (response.data != null) {
          Swal.fire({
            title: 'Verify User',
            html: `
            <table class="table">
            <tr>
              <td>Name:</td>
              <td>${response.data.name}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>${response.data.email}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>${response.data.phoneNumber}</td>
            </tr>
            </table>`,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Ok',
            showCancelButton: true,
            reverseButtons: true
          }).then(result => {
            // if (result.isConfirmed) {
            this.organizationArray = response.data.organizations
            this.getUser(response.data.id)
            // this.setUserId()
            // }
          })
        }
      }, error => {
        // code on user not found
        this.organizationArray = []
        this.initUserInfo({ email })
        this.selectedOrganization = -1
      });
    } else {
      this.commonService.openErrorSnackBar("Please enter a valid email", "")
    }

  }

  checkUserByPhone() {
    // let phone = this.userInfo.value.phoneNumber;
    // if (this.validatePhone(phone)) {
    //   this.endUserService.getUserInfoUsingPhone(phone).subscribe(response => {
    //     if (response.data != null) {
    //       Swal.fire({
    //         title: 'Verify User',
    //         html: `
    //         <table class="table">
    //         <tr>
    //           <td>Name:</td>
    //           <td>${response.data.name}</td>
    //         </tr>
    //         <tr>
    //           <td>Email:</td>
    //           <td>${response.data.email}</td>
    //         </tr>
    //         <tr>
    //           <td>Phone:</td>
    //           <td>${response.data.phoneNumber}</td>
    //         </tr>
    //         </table>`,
    //         cancelButtonText: 'Cancel',
    //         confirmButtonText: 'Ok',
    //         showCancelButton: true,
    //         reverseButtons: true
    //       }).then(result => {
    //         // if (result.isConfirmed) {
    //         this.organizationArray = response.data.organizations
    //         this.getUser(response.data.id)
    //         // this.setUserId()
    //         // }
    //       })
    //     }
    //   }, error => {
    //     // code on user not found
    //     this.organizationArray = []
    //     this.initUserInfo({ phone })
    //     this.selectedOrganization = -1
    //   });
    // } else {
    //   this.commonService.openErrorSnackBar("Please enter a valid phone number", "")
    // }
  }

  getUser(userId) {
    var token = localStorage.getItem('token');
    this.userService.getProfileDetails(userId, token).subscribe(response => {
      this.organizationArray = response.data.organizations
      this.userInfo = this.formBuilder.group(response.data)
      this.setUserId()
    },
      error => {
        console.log("User not available")
      });
  }

  getOrganizationById(orgId) {
    let o = this.organizationArray.find(org => {
      return org.id == orgId
    })
    return o
  }

  getColors(productId) {
    if (productId)
      return this.productList.find(p => { return Number(p.id) == Number(productId) }).colorList
  }

  getLocations(productId) {
    if (productId)
      return this.productList.find(p => { return Number(p.id) == Number(productId) }).locations
  }

  setProduct(event, i) {
    const productId = event.target.value.split(' - ')[0]
    const product = this.productList.find(p => { return p.id == productId })
    if (product) {
      this.orderLineItemsGrid.controls[i].get('productName').setValue(product.name + " - " + product.id)
      this.orderLineItemsGrid.controls[i].get('productId').setValue(product.id)
      this.orderLineItemsGrid.controls[i].get('unitPrice').setValue(product.price)
      this.orderLineItemsGrid.controls[i].get('colorId').setValue(product.colorList[0].id)
      // this.orderLineItemsGrid.controls[i].get('discount').setValue(product.discount)
    } else {
      // this.orderLineItemsGrid.controls[i].get('productName').setValue("")
      this.commonService.openErrorSnackBar("Invalid product id", "")
    }
    this.enableSize(i)
  }

  setCartItemNotes(i) {
    this.cartItemNotes = this.formBuilder.group({
      productNotes: this.orderLineItemsGrid.controls[i].value.productNotes,
      designNotes: this.orderLineItemsGrid.controls[i].value.designNotes,
      i: i
    })
  }

  saveCartItemNotes() {
    const notes = this.cartItemNotes.value
    this.orderLineItemsGrid.controls[notes.i].get("productNotes").setValue(notes.productNotes)
    this.orderLineItemsGrid.controls[notes.i].get("designNotes").setValue(notes.designNotes)
    this.initializeCartItemNotes()
  }

  enableSize(i) {
    const productId = this.orderLineItemsGrid.controls[i].get('productId').value
    const productSizes = this.productList.find(p => { return p.id == productId }).sizes
    this.orderLineItemsGrid.controls[i].get('cartItemGrids')['controls'].forEach((cartItem: FormGroup) => {
      const sizeId = cartItem.get('size').value
      if (productSizes && productSizes.length) {
        for (let size of productSizes) {
          if (size.id == sizeId) {
            cartItem.get('isAvailable').setValue(true)
            break;
          } else {
            cartItem.get('isAvailable').setValue(false)
          }
        }
      } else {
        cartItem.get('isAvailable').setValue(false)
      }
    });
  }

  onQuantityChange(i) {
    let sizes = this.orderLineItemsGrid.controls[i].get('cartItemGrids')['controls']
    let totalQuantity = 0

    sizes.forEach(size => {
      let qty = size.get("quantity").value
      if (qty)
        totalQuantity += qty
    });

    this.orderLineItemsGrid.controls[i].get('quantity').setValue(totalQuantity)
    this.updateTotalPrice(i)
  }

  onPersonalizationChange(i) {
    let personalizationPrice = 0
    if (this.orderLineItemsGrid.controls[i].value.personalizeName) {
      personalizationPrice += 7
    }
    if (this.orderLineItemsGrid.controls[i].value.personalizeNumber) {
      personalizationPrice += 5
    }

  }

  onOrganizationChange(event) {
    if (event.target.value === "ADD") {
      this.selectedOrganization = null
      $("#addOrganizationModal").modal("show")
    } else {
      this.orderLineItemsGrid.controls.forEach((control: FormGroup) => {
        control.get("organizationId").setValue(event.target.value)
      })
      console.log(this.orderLineItemsGrid)
    }
  }

  onColorChange(i) {
    this.orderLineItemsGrid.controls[i].get("cartItemGrids")["controls"].forEach((element: FormGroup) => {
      element.get("colorId").setValue(this.orderLineItemsGrid.controls[i].value.colorId)
    });
  }

  updateTotalPrice(i) {
    let { discount, quantity, unitPrice } = this.orderLineItemsGrid.value[i]
    let personalizationPrice = 0
    let isPersonalize = false

    if (this.orderLineItemsGrid.controls[i].value.personalizeName) {
      personalizationPrice += 7
      isPersonalize = true
    }

    if (this.orderLineItemsGrid.controls[i].value.personalizeNumber) {
      personalizationPrice += 5
      isPersonalize = true
    }

    switch (Number(this.orderLineItemsGrid.controls[i].value.serviceId)) {
      case 1:
        personalizationPrice += 8;
        break;
      case 2:
        personalizationPrice += 10;
        break;
      case 11:
        personalizationPrice += 8;
        break;
      case 12:
        personalizationPrice += 10;
        break;
    }

    if (personalizationPrice > 0) {
      this.orderLineItemsGrid.controls[i].get("isPersonalize").setValue(isPersonalize)
      this.orderLineItemsGrid.controls[i].get("personalizationPrice").setValue(personalizationPrice * quantity)
      this.orderLineItemsGrid.controls[i].get("personalizedQuantity").setValue(quantity)
    } else {
      this.orderLineItemsGrid.controls[i].get("isPersonalize").setValue(false)
      this.orderLineItemsGrid.controls[i].get("personalizationPrice").setValue(0)
      this.orderLineItemsGrid.controls[i].get("personalizedQuantity").setValue(0)
    }

    let totalPrice = ((quantity * (unitPrice + personalizationPrice)) - discount).toFixed(2)
    this.orderLineItemsGrid.controls[i].get('totalPrice').setValue(totalPrice)
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePhone(phone) {
    // const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return re.test(String(phone).toLowerCase());
    return true
  }

  updateUserBillingAddress() {
    let form = document.getElementById("updateBillingAddressForm") as HTMLFormElement
    if (this.updateBillingAddressForm.get("billingState").value == -1) {
      this.updateBillingAddressForm.get("billingState").setValue(null)
    }
    if (form.checkValidity()) {
      this.userInfo.get("billingAddress").setValue(this.updateBillingAddressForm.get("billingAddress").value)
      this.userInfo.get("billingAddress1").setValue(this.updateBillingAddressForm.get("billingAddress1").value)
      this.userInfo.get("billingCity").setValue(this.updateBillingAddressForm.get("billingCity").value)
      this.userInfo.get("billingState").setValue(this.updateBillingAddressForm.get("billingState").value)
      this.userInfo.get("billingZipCode").setValue(this.updateBillingAddressForm.get("billingZipCode").value)
      this.closeModal()
    } else {
      this.commonService.openErrorSnackBar("Fill all values", "")
      form.classList.add('was-validated')
    }
  }

  updateUserShippingAddress() {
    let form = document.getElementById("updateShippingAddressForm") as HTMLFormElement
    if (this.updateShippingAddressForm.get("shippingState").value == -1) {
      this.updateShippingAddressForm.get("shippingState").setValue(null)
    }
    if (form.checkValidity()) {
      this.userInfo.get("shippingAddress").setValue(this.updateShippingAddressForm.get("shippingAddress").value)
      this.userInfo.get("shippingAddress1").setValue(this.updateShippingAddressForm.get("shippingAddress1").value)
      this.userInfo.get("shippingCity").setValue(this.updateShippingAddressForm.get("shippingCity").value)
      this.userInfo.get("shippingState").setValue(this.updateShippingAddressForm.get("shippingState").value)
      this.userInfo.get("shippingZipCode").setValue(this.updateShippingAddressForm.get("shippingZipCode").value)
      this.closeModal()
    } else {
      this.commonService.openErrorSnackBar("Fill all values", "")
      form.classList.add('was-validated')
    }
  }

  closeModal() {
    $("#billingAddressModal").modal("hide")
    $("#shippingAddressModal").modal("hide")
    $("#updateShippingAddressForm").removeClass('was-validated')
    $("#updateBillingAddressForm").removeClass('was-validated')
    this.createAddressForm()
  }

  closeOrganizationModal() {
    this.initializeOrganizationForm()
    $("#addOrganizationModal").modal("hide")
    document.getElementById("organizationForm").classList.remove("was-validated")
  }

  openDesigner(i) {
    this.bulkOrderEntryDesignIndex = i
    const productId = this.orderLineItemsGrid.controls[i].get('productId').value
    if (productId) {
      // if (this.validateUser(4)) {
      localStorage.setItem('bulkOrderEntry', JSON.stringify(this.orderLineItemsGrid.value))
      localStorage.setItem('bulkOrderEntryUserId', JSON.stringify(this.userInfo.value.id))
      localStorage.setItem('bulkOrderEntryDesignIndex', JSON.stringify(i))
      this.router.navigateByUrl("/storemanager/bulkorderentry/designer/" + productId)
      // }
    } else {
      this.commonService.openErrorSnackBar("Select a product to design", "")
    }

  }

  openOrderNotes(action) {
    let valid = false
    if (this.validateFormData() && this.validateQuantity() && this.validateUser(action)) {
      if (this.validateAddress()) {
        if (action == 1) {
          // if (this.selectedShippingMethod) {
          valid = true
          // } else {
          //   this.commonService.openErrorSnackBar("Select shipping method to continue", "")
          // }
        } else if (action == 2) {
          valid = true
        }
      }
    }
    if (valid) {
      this.action = action
      $("#order-notes-modal").modal("show")
    }
  }

  saveOrderNotes() {
    this.orderLineItemsGrid.controls.forEach((control: FormGroup) => {
      control.get("orderNotes").setValue(this.orderNotes)
    })
    if (this.action == 2) {
      this.submitQuote()
    } else if (this.action == 1) {
      if (this.checkDiscount()) {
        Swal.fire({
          icon: 'info',
          title: 'Discount approval pending',
          html: `<h5>Your order will be saved as draft and you can make the payment after discount verification</h5>`,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Ok',
          showCancelButton: true,
          reverseButtons: true
        }).then(result => {
          if (result.isConfirmed) {
            this.submitQuote()
          }
        })
      } else {
        $("#card-detail-modal").modal("show")
      }
    }
  }

  setUserId() {
    for (let i = 0; i < this.orderLineItemsGrid.controls.length; i++) {
      this.orderLineItemsGrid.controls[i].get("customerId").setValue(this.userInfo.value.id)
    }
  }

  checkProductQuantity() {
    this.orderLineItemsGrid.value.forEach(element => {
      let totalSizeQuantities = 0;
      element.cartItemGrids.forEach(item => {
        if (item.quantity != null)
          totalSizeQuantities += item.quantity;
      });
      if (element.quantity != totalSizeQuantities && totalSizeQuantities != 0) {
        this.commonService.openErrorSnackBar('Selected quantity is more than total quantity', '')
        return;
      }
    });

    this.submitQuote();
  }

  submitQuote() {
    if (this.validateUser(2)) {
      let message = "Quote submitted successfully"
      if (this.checkDiscount()) {
        message += "<br>Discount Application sent to finance manager"
      }
      this.storeService.addToCartBulk(this.orderLineItemsGrid.value, 2).subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          html: `<h5>${message}</h5>`,
        }).then(() => {
          this.router.navigateByUrl("/storemanager/bulkorderentrylist")
        })
      })
    }
  }

  checkDiscount() {
    let isDiscountApproved = false

    for (let i = 0; i < this.orderLineItemsGrid.controls.length; i++) {
      if (this.orderLineItemsGrid.controls[i].value.discount 
        && this.orderLineItemsGrid.controls[i].value.discount > 0
        && this.orderLineItemsGrid.controls[i].value.isDiscountApproved == false) {
        isDiscountApproved = true
      }
    }
    return isDiscountApproved
  }

  saveAsDraft() {
    if (this.validateFormData()) {
      if (this.validateUser(3)) {
        this.storeService.addToCartBulk(this.orderLineItemsGrid.value, 3).subscribe(res => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Saved as draft successfully',
          }).then(() => {
            this.router.navigate(['/storemanager/bulkorderentrylist']);
          })
          // this.commonService.openSuccessSnackBar("Saved as draft successfully", "")
          // this.orderLineItemsGrid.controls.forEach(element => {
          //   element.get('referenceId').setValue(res.data)
          // });
        })
      }
    }
  }

  payNow() {
    this.cardInfo.get("expirationDate").setValue(this.cardInfo.value.expYear + "-" + this.cardInfo.value.expMonth)
    // if (this.validateUser(1)) {
    if (this.validateCardDetails()) {

      let formData = new FormData()
      let checkoutObj = this.orderLineItemsGrid.value
      let billingAddress = {
        billingAddress: this.userInfo.get("billingAddress").value,
        billingAddress1: this.userInfo.get("billingAddress1").value,
        billingCity: this.userInfo.get("billingCity").value,
        billingState: this.userInfo.get("billingState").value,
        billingZipCode: this.userInfo.get("billingZipCode").value
      }

      let shippingAddress = {
        shippingAddress: this.userInfo.get("shippingAddress").value,
        shippingAddress1: this.userInfo.get("shippingAddress1").value,
        shippingCity: this.userInfo.get("shippingCity").value,
        shippingState: this.userInfo.get("shippingState").value,
        shippingZipCode: this.userInfo.get("shippingZipCode").value
      }
      let totalAmount = 0
      checkoutObj.forEach(element => {
        totalAmount += Number(element.totalPrice)
      });
      const orderJson = {
        amount: totalAmount,
        shippingAmount: this.selectedShippingMethod ? this.selectedShippingMethod.price : 0,
        orderItem: {
          cartItemsInfo: checkoutObj,
          CardInfo: this.cardInfo.value,
          billingAddress,
          shippingAddress,
          totalPrice: totalAmount,
          customerId: this.userInfo.value.id,
        },
        paymentType: 3,
      }
      formData.append("orderJson", JSON.stringify(orderJson))
      this.storeService.createOrder(formData).subscribe(res => {
        if (res.data.transactionStatus == 6 || res.data.transactionStatus == 8) {
          Swal.fire({
            title: "Order Placed",
            text: "Your payment is approved and Order is being processed",
            icon: "success",
          }).then(() => {
            $("#card-detail-modal").modal("hide")
            this.router.navigate(['/storemanager/bulkorderentrylist']);
          })
        } else {
          Swal.fire({
            title: "Order Rejected",
            text: "Your payment method is rejected. Please retry with alternate payment method",
            icon: "error",
          })
        }
      },
        err => {
          Swal.fire({
            title: "Order Rejected",
            text: "Your payment method is rejected. Please retry with alternate payment method",
            icon: "error",
          })
        })
    } else { }
    // }
  }

  downloadQuote() {

  }

  validateCardNumber() {
    this.cardInfo.get('cardNumber').markAllAsTouched()
    if (this.isCreditCard() && this.checkLuhn()) {
      return true
    } else {
      return false
    }
  }

  validateCardDetails() {
    if (this.cardInfo.valid) {
      return this.validateCardNumber()
    } else {
      if (this.cardInfo.get("cardNumber").invalid)
        this.commonService.openErrorSnackBar("Invalid card number", "")
      else if (this.cardInfo.get("cardCode").invalid)
        this.commonService.openErrorSnackBar("Invalid CVV", "")
      else
        this.commonService.openErrorSnackBar("Invalid Expiration Date", "")

      this.cardInfo.markAllAsTouched()
      return false;
    }
  }

  checkLuhn() {
    let cardNo = this.cardInfo.value.cardNumber
    let nDigits = cardNo.length;
    let nSum = 0;
    let isSecond = false;
    for (let i = nDigits - 1; i >= 0; i--) {

      let d = Number(cardNo[i])

      if (isSecond == true)
        d = d * 2;

      if (d > 9)
        d = (d % 10) + (d / 10)

      nSum += d
      isSecond = !isSecond;
    }
    if (nSum % 10 == 0) {
      return true
    } else {
      this.commonService.openErrorSnackBar("Invalid Credit Card", "")
      return false
    }
  }

  isCreditCard() {
    let cardNo = this.cardInfo.value.cardNumber
    const regexp = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;

    if (regexp.test(cardNo)) {
      return true;
    } else {
      this.commonService.openErrorSnackBar("Invalid Credit Card", "")
      return false;
    }
  }

  onCreditCardKeyDown(event) {
    let length = 15
    const cardPrefix = this.cardInfo.value.cardNumber ? Number(this.cardInfo.value.cardNumber.toString().substring(0, 2)) : null
    if (cardPrefix) {
      loop1:
      for (let key in this.availableCards) {
        loop2:
        for (let prefix of this.availableCards[key].prefix) {
          if (this.cardInfo.value.cardNumber.toString().startsWith(prefix)) {
            length = this.availableCards[key].length
            break loop1;
          }
        }
      }
    }
    if (['.', '+', '-', 'e'].indexOf(event.key) >= 0)
      return false
    else if (Number(event.key) != NaN && Number(event.key) <= 9)
      return event.target.value.toString().length >= length ? false : true;
    else
      return true
  }

  onCVVKeyDown(event) {
    let length = 3
    const cvv = Number(event.key)
    const cardPrefix = this.cardInfo.value.cardNumber ? Number(this.cardInfo.value.cardNumber.toString().substring(0, 2)) : null
    if (cardPrefix && this.availableCards.AE.prefix.indexOf(cardPrefix) != -1) {
      length = 4
    }
    if (cvv && cvv <= 9)
      return event.target.value.length >= length ? false : true;
    else
      return true
  }

  selectShippingMethod(id) {
    this.selectedShippingMethod = this.shippingMethods.find((el) => {
      return el.id == id
    })
  }

  validateFormData() {
    if (this.orderLineItemsGrid.valid) {
      return true
    } else {
      this.commonService.openErrorSnackBar("Please enter all required values in product details", "")
      return false
    }
  }

  validateAddress() {
    if (!this.userInfo.value.billingAddress) {
      this.commonService.openErrorSnackBar("Please enter a valid billing address", "")
      return false
    } else if (!this.userInfo.value.shippingAddress) {
      this.commonService.openErrorSnackBar("Please enter a valid shipping address", "")
      return false
    } else {
      return true
    }
  }

  validateUser(action) {
    if (this.userInfo.value.id) {
      return true
    } else if (this.userInfo.value.email) {
      this.createNewUser(action)
      return false
    } else if (!this.userInfo.value.email) {
      this.commonService.openErrorSnackBar("Enter user information to continue", "")
      return false
    }
  }

  validateQuantity() {
    let valid = false
    for (let control of this.orderLineItemsGrid.controls) {
      if (control.value.quantity && Number(control.value.quantity) > 0) {
        let selectedQuantity = 0
        for (let sizes of control.value.cartItemGrids) {
          if (Number(sizes.quantity))
            selectedQuantity += Number(sizes.quantity)
        }
        if (selectedQuantity == 0 || control.value.quantity == selectedQuantity) {
          valid = true
        } else {
          this.commonService.openErrorSnackBar("Selected quantity and total quantity must be equal", "")
          valid = false
          break;
        }
      } else {
        this.commonService.openErrorSnackBar("Please select quantity in product data", "")
        break;
      }
    }
    return valid
  }


  // getDecoServices(i,j){
  //   let locationId = this.orderLineItemsGrid.get("cartItemGrids")['controls'][i].get('artMapping').controls[j].value.positionId || null
  //   if(locationId && this.productLocationArray[i] && this.productLocationArray[i].length)
  //     return this.productLocationArray[i].find(loc=> loc.id == locationId).services
  //   return []
  // }
}
