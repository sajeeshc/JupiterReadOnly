import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";
import { StoreService } from "src/app/core/services/store.service";
import { UserService } from "src/app/core/services/user.service";
import { EnduserService } from "src/app/core/services/enduser.service";

const dropin = require("braintree-web-drop-in");
declare var $: any;
import Swal from "sweetalert2";
import { SharedService } from "src/app/core/services/shared.service";
import { add } from "date-fns";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: [
    "../../../app/modules/end-user/end-user.component.scss",
    "./checkout.component.scss",
  ],
})
export class CheckoutComponent implements OnInit {
  loading = false;
  teamStoreId;
  cartItems: any;
  paymentMethod: number = 3;
  user: any;
  totalAmount: number = 0;
  totalNumberOfProducts: number = 0;
  currentDate = new Date().toLocaleDateString();
  teamStore: any;
  updatedBillingAddress: FormGroup;
  updatedShippingAddress: FormGroup;
  isShippingAddressSameAsBillingAddress = false;
  organizationArray: any;
  selectedOrganization: any;
  checkoutObj: any;
  states: any[] = [];
  shippingMethods: any = [];
  freeShipping = {
    id: 3,
    name: "Free shipping",
    price: 0,
  };
  uploadedPO: any;
  selectedShippingMethod: any;
  creditApprovalCode: string;
  billingAddress;
  shippingAddress;
  private INSTANCE: any;
  purchaseType: number;
  serviceArray = [];
  cardInfo: FormGroup;
  cardExpYears = [];
  availableCards = {
    AE: { prefix: [34, 37], length: 15 },
    V: { prefix: [4], length: 16 },
    MC: { prefix: [51, 52, 53, 54, 55], length: 16 },
    D: { prefix: [6011, 5], length: 16 },
    DC: { prefix: [300, 301, 302, 303, 304, 305, 36, 38], length: 14 },
    JCB: { prefix: [2131, 1800, 35], length: 16 },
  };
  personalizationTypes = [
    "(No personalization)",
    "(Name)",
    "(Number)",
    "(Name, Number)",
    "(Not available)",
  ];
  taxObject;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private commonService: CommonService,
    private userService: UserService,
    private fb: FormBuilder,
    private endUserService: EnduserService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.teamStoreId = Number(localStorage.getItem("teamStoreId"));
    this.checkoutObj = JSON.parse(localStorage.getItem("checkoutObj"));
    this.purchaseType = JSON.parse(localStorage.getItem("purchaseType"));
    this.resetAddress();
    this.getUserDetails();
    this.getTeamStore();
    this.createAddressForm();
    this.getOrganizations();
    this.getStates();
    // this.initPaymentUI()
    this.initializeCardInfo();
    this.getAvailableStoreServices();
    this.getShippingMethods();
  }

  getShippingMethods() {
    if (this.purchaseType == 3) return;
    this.sharedService.getShippingMethods().subscribe((res: any) => {
      this.shippingMethods = res.data;
    });
  }

  getShippingCharge() {
    if (this.teamStoreId) return;
    this.loading = true;
    let data = {
      shipTo: {
        zipCode: this.shippingAddress.zipCode,
        country: "US",
      },
      packages: this.checkoutObj.shippingBoxes,
      totalWeight: this.checkoutObj.totalWeight,
    };
    this.sharedService
      .getShippingCharge(this.selectedShippingMethod.code, data)
      .subscribe(
        (res) => {
          this.selectedShippingMethod["price"] = Number(
            res.data.totalCharges.monetaryValue
          );
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  initializeCardInfo() {
    this.cardInfo = this.fb.group({
      cardNumber: [
        "",
        [
          Validators.required,
          Validators.min(10000000000000),
          Validators.max(9999999999999999),
        ],
      ],
      expMonth: ["0", [Validators.required, Validators.min(1)]],
      expYear: ["0", [Validators.required, Validators.min(1)]],
      expirationDate: ["", [Validators.required]],
      cardCode: ["", [Validators.required, Validators.minLength(3)]],
    });
    let year = new Date().getFullYear();
    for (let i = 0; i < 15; i++) {
      this.cardExpYears.push(year);
      year++;
    }
  }

  getTeamStore() {
    if (!this.teamStoreId) return;
    this.storeService.getStore(this.teamStoreId).subscribe((response) => {
      this.teamStore = response.data;
      this.setAddress();
      this.shippingMethods = this.teamStore.availableShippingMethods;
      this.selectShippingMethod(this.shippingMethods[0].id)
      // if (this.teamStore && this.teamStore.shippingPreference === 2) {
      //   this.selectedShippingMethod = this.freeShipping
      // }
    });
  }

  getUserDetails() {
    let userId = localStorage.getItem("userId");
    let token = localStorage.getItem("token");
    this.userService.getProfileDetails(userId, token).subscribe((response) => {
      this.user = response.data;
      // this.updateShippingAddressAsBillingAddress(this.user.isSameAsBillingAddress)
      this.isShippingAddressSameAsBillingAddress =
        this.user.isSameAsBillingAddress;
      this.setAddress();
    });
  }

  updateShippingAddressAsBillingAddress(state) {
    this.isShippingAddressSameAsBillingAddress = state;
    if (state) {
      this.shippingAddress = { ...this.billingAddress };
      this.shippingAddress["isEditable"] = false;
    } else {
      this.shippingAddress = {
        address: this.user.shippingAddress,
        address1: this.user.shippingAddress1,
        city: this.user.shippingCity,
        state:
          this.getState(this.user.shippingState).name ||
          this.user.shippingState,
        zipCode: this.user.shippingZipCode,
        isEditable: true,
      };
    }
    this.getTax();
    this.validateAddress();
  }

  createAddressForm() {
    this.updatedBillingAddress = this.fb.group({
      billingAddress: new FormControl(this.billingAddress.address || ""),
      billingAddress1: new FormControl(this.billingAddress.address1 || ""),
      billingCity: new FormControl(this.billingAddress.city || ""),
      billingState: new FormControl(
        this.getState(this.billingAddress.state).name ||
          this.billingAddress.state,
        Validators.min(0)
      ),
      billingZipCode: new FormControl(this.billingAddress.zipCode || ""),
      updateProfile: new FormControl(false),
    });
    this.updatedShippingAddress = this.fb.group({
      shippingAddress: new FormControl(this.shippingAddress.address || ""),
      shippingAddress1: new FormControl(this.shippingAddress.address1 || ""),
      shippingCity: new FormControl(this.shippingAddress.city || ""),
      shippingState: new FormControl(
        this.getState(this.shippingAddress.state).name ||
          this.shippingAddress.state,
        Validators.min(0)
      ),
      shippingZipCode: new FormControl(this.shippingAddress.zipCode || ""),
      updateProfile: new FormControl(false),
    });
  }

  updateBillingAddress() {
    let form = document.getElementById(
      "updatedBillingAddressForm"
    ) as HTMLFormElement;
    if (this.updatedBillingAddress.get("billingState").value == -1) {
      this.updatedBillingAddress.get("billingState").setValue(null);
    }
    if (form.checkValidity()) {
      this.user.billingAddress =
        this.updatedBillingAddress.get("billingAddress").value;
      this.user.billingAddress1 =
        this.updatedBillingAddress.get("billingAddress1").value;
      this.user.billingCity =
        this.updatedBillingAddress.get("billingCity").value;
      this.user.billingState =
        this.updatedBillingAddress.get("billingState").value;
      this.user.billingZipCode =
        this.updatedBillingAddress.get("billingZipCode").value;

      this.user.isSameAsBillingAddress =
        this.isShippingAddressSameAsBillingAddress;

      if (this.isShippingAddressSameAsBillingAddress) {
        this.user.shippingAddress =
          this.updatedBillingAddress.get("billingAddress").value;
        this.user.shippingAddress1 =
          this.updatedBillingAddress.get("billingAddress1").value;
        this.user.shippingCity =
          this.updatedBillingAddress.get("billingCity").value;
        this.user.shippingState =
          this.updatedBillingAddress.get("billingState").value;
        this.user.shippingZipCode =
          this.updatedBillingAddress.get("billingZipCode").value;
        this.user.isSameAsBillingAddress = true;
      }
      if (this.updatedBillingAddress.get("updateProfile").value) {
        this.updateUserProfile();
      }
      this.setAddress();
      this.closeModal();
    } else {
      this.commonService.openErrorSnackBar("Fill all values", "");
      form.classList.add("was-validated");
    }
  }

  updateShippingAddress() {
    let form = document.getElementById(
      "updatedShippingAddressForm"
    ) as HTMLFormElement;
    if (this.updatedShippingAddress.get("shippingState").value == -1) {
      this.updatedShippingAddress.get("shippingState").setValue(null);
    }
    if (form.checkValidity()) {
      this.user.shippingAddress =
          this.updatedShippingAddress.get("shippingAddress").value;
        this.user.shippingAddress1 =
          this.updatedShippingAddress.get("shippingAddress1").value;
        this.user.shippingCity =
          this.updatedShippingAddress.get("shippingCity").value;
        this.user.shippingState =
          this.updatedShippingAddress.get("shippingState").value;
        this.user.shippingZipCode =
          this.updatedShippingAddress.get("shippingZipCode").value;
        this.user.isSameAsBillingAddress =
          this.isShippingAddressSameAsBillingAddress;
      if (this.updatedShippingAddress.get("updateProfile").value) {
        this.updateUserProfile();
      }
      this.setAddress()
      this.closeModal();
      this.getTax();
      this.validateAddress();
    } else {
      this.commonService.openErrorSnackBar("Fill all values", "");
      form.classList.add("was-validated");
    }
  }

  updateUserProfile() {
    const token = localStorage.getItem("token");
    this.userService
      .updateProfileDetails(this.user, token)
      .subscribe((response: any) => {
        if (response.status == 1) {
          this.commonService.openSuccessSnackBar("User profile updated", "");
        }
      });
  }

  closeModal() {
    $("#billingAddressModal").modal("hide");
    $("#shippingAddressModal").modal("hide");
    $("#updatedShippingAddressForm").removeClass("was-validated");
    $("#updatedBillingAddressForm").removeClass("was-validated");
    this.createAddressForm();
  }

  getOrganizations() {
    const params = { isApproved: true };
    this.userService.getCreditOrganizations(params).subscribe((response) => {
      this.organizationArray = response.data;
    });
  }

  selectOrganization(id = null) {
    this.selectedOrganization = this.organizationArray.find((el) => {
      return el.id == id;
    });
    this.setAddress();
  }

  selectShippingMethod(id) {
    this.selectedShippingMethod = this.shippingMethods.find((el) => {
      return el.id == id;
    });
    if (!this.selectedShippingMethod.price) this.getShippingCharge();
  }

  setAddress() {
    // teamstore purchase
    if (this.purchaseType == 3) {
      // shipping preference = individual
      if (this.teamStore && this.teamStore.shippingPreference === 1) {
        // payment method = credit
        if (this.paymentMethod === 3) {
          this.resetAddress(true, true, true);
          if (this.user) {
            this.billingAddress = {
              address: this.user.billingAddress,
              address1: this.user.billingAddress1,
              city: this.user.billingCity,
              state:
                this.getState(this.user.billingState).name ||
                this.user.billingState,
              zipCode: this.user.billingZipCode,
              isEditable: true,
            };
            if (this.user.isSameAsBillingAddress) {
              this.shippingAddress = { ...this.billingAddress };
              this.shippingAddress.isEditable = false;
            } else {
              this.shippingAddress = {
                address: this.user.shippingAddress,
                address1: this.user.shippingAddress1,
                city: this.user.shippingCity,
                state:
                  this.getState(this.user.shippingState).name ||
                  this.user.shippingState,
                zipCode: this.user.shippingZipCode,
                isEditable: true,
              };
            }
          }

          // payment method = invoice
        } else if (this.paymentMethod === 1 || this.paymentMethod === 2) {
          this.resetAddress(true, true, false);
          if (this.selectedOrganization) {
            this.billingAddress = {
              orgName: this.selectedOrganization.name,
              address: this.selectedOrganization.address || "",
              address1: this.selectedOrganization.address1 || "",
              city: this.selectedOrganization.city || "",
              state:
                this.getState(this.selectedOrganization.state).name ||
                this.selectedOrganization.state,
              zipCode: this.selectedOrganization.zip || "",
              isEditable: false,
            };
          }
          if (this.user) {
            this.shippingAddress = {
              address: this.user.shippingAddress,
              address1: this.user.shippingAddress1,
              city: this.user.shippingCity,
              state:
                this.getState(this.user.shippingState).name ||
                this.user.shippingState,
              zipCode: this.user.shippingZipCode,
              isEditable: true,
            };
          }
        }
      }
      // shipping freference = bulk
      else if (this.teamStore && this.teamStore.shippingPreference === 2) {
        // shipping address is always shipTo address of store
        let addArr = this.teamStore.shipToAddress.split(',')
        let state = this.getState(addArr[addArr.length-2])
        this.shippingAddress = {
          address: this.teamStore.organizationName,
          address1: this.teamStore.shipToAddress.split(addArr[addArr.length-3])[0].trim(),
          city: addArr[addArr.length-3].trim(),
          state: (state.name ? state.name.trim() : addArr[addArr.length-2].trim()),
          zipCode: addArr[addArr.length-1].trim(),
          isEditable: false,
        };
        // payment method = credit
        if (this.paymentMethod === 3) {
          this.resetAddress(true, false, true);
          if (this.user) {
            this.billingAddress = {
              address: this.user.billingAddress,
              address1: this.user.billingAddress1,
              city: this.user.billingCity,
              state:
                this.getState(this.user.billingState).name ||
                this.user.billingState,
              zipCode: this.user.billingZipCode,
              isEditable: true,
            };
          }
          //payment method = invoice
        } else if (this.paymentMethod === 1 || this.paymentMethod === 2) {
          this.resetAddress(true, false, false);
          if (this.selectedOrganization) {
            this.billingAddress = {
              orgName: this.selectedOrganization.name,
              address: this.selectedOrganization.address || "",
              address1: this.selectedOrganization.address1 || "",
              city: this.selectedOrganization.city || "",
              state:
                this.getState(this.selectedOrganization.state).name ||
                this.selectedOrganization.state,
              zipCode: this.selectedOrganization.zip || "",
              isEditable: false,
            };
          }
        }
      } else if (this.user) {
        this.billingAddress = {
          address: this.user.billingAddress,
          address1: this.user.billingAddress1,
          city: this.user.billingCity,
          state:
            this.getState(this.user.billingState).name ||
            this.user.billingState,
          zipCode: this.user.billingZipCode,
          isEditable: true,
        };
        if (this.user.isSameAsBillingAddress) {
          this.shippingAddress = { ...this.billingAddress };
          this.shippingAddress.isEditable = false;
        } else {
          this.shippingAddress = {
            address: this.user.shippingAddress,
            address1: this.user.shippingAddress1,
            city: this.user.shippingCity,
            state:
              this.getState(this.user.shippingState).name ||
              this.user.shippingState,
            zipCode: this.user.shippingZipCode,
            isEditable: true,
          };
        }
      }
      // direct purchase
    } else {
      if (this.paymentMethod === 1 || this.paymentMethod === 2) {
        this.resetAddress(true, true, false);
        if (this.selectedOrganization) {
          this.billingAddress = {
            orgName: this.selectedOrganization.name,
            address: this.selectedOrganization.address || "",
            address1: this.selectedOrganization.address1 || "",
            city: this.selectedOrganization.city || "",
            state:
              this.getState(this.selectedOrganization.state).name ||
              this.selectedOrganization.state,
            zipCode: this.selectedOrganization.zip || "",
            isEditable: false,
          };
          this.shippingAddress = {
            orgName: this.selectedOrganization.name,
            address: this.selectedOrganization.address || "",
            address1: this.selectedOrganization.address1 || "",
            city: this.selectedOrganization.city || "",
            state:
              this.getState(this.selectedOrganization.state).name ||
              this.selectedOrganization.state,
            zipCode: this.selectedOrganization.zip || "",
            isEditable: false,
          };
        }
      } else if (this.paymentMethod == 3) {
        this.resetAddress(true, true, true);
        if (this.user) {
          this.billingAddress = {
            address: this.user.billingAddress,
            address1: this.user.billingAddress1,
            city: this.user.billingCity,
            state:
              this.getState(this.user.billingState).name ||
              this.user.billingState,
            zipCode: this.user.billingZipCode,
            isEditable: true,
          };
          if (this.user.isSameAsBillingAddress) {
            this.shippingAddress = { ...this.billingAddress };
            this.shippingAddress.isEditable = false;
          } else {
            this.shippingAddress = {
              address: this.user.shippingAddress,
              address1: this.user.shippingAddress1,
              city: this.user.shippingCity,
              state:
                this.getState(this.user.shippingState).name ||
                this.user.shippingState,
              zipCode: this.user.shippingZipCode,
              isEditable: true,
            };
          }
        }
      }
    }
    this.getTax();
    this.createAddressForm();
    this.validateAddress();
  }

  getTax() {
    let stateCode = "";
    let state = this.states.find(
      (state) => Number(state.name) == this.shippingAddress.state
    );
    stateCode = state ? state.code : "";

    if (
      this.shippingAddress.state &&
      this.shippingAddress.zipCode &&
      this.checkoutObj.totalPrice
    ) {
      this.sharedService
        .getTax({
          // "Address": "920 W Main St",
          // "City": "Ohio",
          State:
            this.getState(this.shippingAddress.state).name ||
            this.shippingAddress.state,
          ZipCode: this.shippingAddress.zipCode,
          // "Country": "US",
          Amount: this.checkoutObj.totalPrice,
        })
        .subscribe((res) => {
          this.taxObject = res.data;
        });
    }
  }

  resetAddress(
    billing: boolean = true,
    shipping: boolean = true,
    isEditable: boolean = true
  ) {
    if (billing) {
      this.billingAddress = {
        address: "",
        address1: "",
        city: "",
        state: "",
        zipCode: "",
        isEditable,
      };
    }
    if (shipping) {
      this.shippingAddress = {
        address: "",
        address1: "",
        city: "",
        state: "",
        zipCode: "",
        isEditable,
      };
    }
  }

  checkout() {
    this.validateAddress();
    if (this.checkoutObj) {
      if (
        !this.billingAddress.address ||
        this.billingAddress.address.length < 1
      ) {
        this.commonService.openErrorSnackBar(
          "Please enter billing address",
          ""
        );
      } else if (
        !this.shippingAddress.address ||
        this.shippingAddress.address.length < 1
      ) {
        this.commonService.openErrorSnackBar(
          "Please enter shipping address",
          ""
        );
      } else if (!this.selectedShippingMethod) {
        this.commonService.openErrorSnackBar(
          "Please select a shipping method",
          ""
        );
      } else if (!this.shippingAddress.validAddressIndicator) {
        this.commonService.openErrorSnackBar("Invalid shipping address", "");
      } else if (!this.billingAddress.validAddressIndicator) {
        this.commonService.openErrorSnackBar("Invalid billing address", "");
      } else {
        switch (this.paymentMethod) {
          case 3:
            this.payByCreditCard();
            break;
          case 1:
            this.payByInvoice();
            break;
          case 2:
            this.payByPo();
            break;
          default:
            this.commonService.openWarningSnackBar(
              "Select valid payment method",
              ""
            );
            break;
        }
      }
    } else {
      this.commonService.openErrorSnackBar("Please add items to cart", "");
    }
    return false;
  }

  payByCreditCard() {
    // this.INSTANCE.requestPaymentMethod()
    //   .then(payload => {
    this.cardInfo
      .get("expirationDate")
      .setValue(
        this.cardInfo.value.expYear + "-" + this.cardInfo.value.expMonth
      );
    if (this.validateCardDetails()) {
      let formData = new FormData();
      this.checkoutObj["billingAddress"] = this.billingAddress;
      this.checkoutObj["shippingAddress"] = this.shippingAddress;
      this.checkoutObj["cardInfo"] = this.cardInfo.value;
      this.checkoutObj["taxAmount"] = this.taxObject.totalTax;
      this.checkoutObj["taxSummary"] = this.taxObject.summary;
      const orderJson = {
        amount: (
          this.checkoutObj.totalPrice +
          (this.selectedShippingMethod.price || 0) +
          this.taxObject.totalTax
        ).toFixed(2),
        subTotal: this.checkoutObj.totalPrice,
        shippingAmount: this.selectedShippingMethod.price,
        // paymentMethodNonce: payload.nonce,
        orderItem: this.checkoutObj,
        paymentType: this.paymentMethod,
        shippingMethodId: this.selectedShippingMethod.id,
      };
      formData.append("orderJson", JSON.stringify(orderJson));
      this.loading = true;
      this.storeService.createOrder(formData).subscribe(
        (res) => {
          this.loading = false;
          if (
            res.data.transactionStatus == 6 ||
            res.data.transactionStatus == 8
          ) {
            Swal.fire({
              title: "Order Placed",
              text: "Your payment is approved and Order is being processed",
              icon: "success",
              position: "top",
            }).then(() => {
              this.router.navigate(["/enduser/useraccount/orderhistory"]);
              // window.parent.postMessage("Order placed successfully!", "*");
            });
          } else {
            Swal.fire({
              title: "Order Rejected",
              text: "Your payment method is rejected. Please retry with alternate payment method",
              icon: "error",
              position: "top",
            });
            // this.commonService.openErrorSnackBar(res.data.message, "");
          }
        },
        (err) => {
          this.loading = false;
          Swal.fire({
            title: "Order Rejected",
            text: "Your payment method is rejected. Please retry with alternate payment method",
            icon: "error",
            position: "top",
          });
        }
      );
    }

    // this.INSTANCE.teardown(function (teardownErr) {
    //   if (teardownErr) {
    //     console.error('Could not tear down Drop-in UI!');
    //   } else {
    //     $('#submit-button').remove();
    //   }
    // });

    // }, err => {
    //   console.log("err - ")
    //   console.log(err)
    // })
    // .catch(err => {
    //   console.log(err)
    // })
  }

  payByPo() {
    if (this.uploadedPO) {
      $("#submit-button").remove();
      let formData = new FormData();
      formData.append("file", this.uploadedPO);
      this.checkoutObj["billingAddress"] = this.billingAddress;
      this.checkoutObj["shippingAddress"] = this.shippingAddress;
      this.checkoutObj["taxAmount"] = this.taxObject.totalTax;
      this.checkoutObj["taxSummary"] = this.taxObject.summary;
      const orderJson = {
        amount: (
          this.checkoutObj.totalPrice +
          this.selectedShippingMethod.price +
          this.taxObject.totalTax
        ).toFixed(2),
        subTotal: this.checkoutObj.totalPrice,
        shippingAmount: this.selectedShippingMethod.price,
        orderItem: this.checkoutObj,
        paymentType: this.paymentMethod,
      };
      formData.append("orderJson", JSON.stringify(orderJson));
      this.loading = true;
      this.storeService.createOrder(formData).subscribe(
        (res) => {
          this.loading = false;
          if (res.statusCode == 200) {
            Swal.fire({
              title: "Order Placed",
              text: `Your order with a Purchase Order has been received. 
                   Processing of this order is contingent upon approval from the Areswear team. 
                   Please check your email or user profile for further order status.`,
              icon: "success",
              position: "top",
            }).then(() => {
              this.router.navigate(["/enduser/useraccount/orderhistory"]);
              // window.parent.postMessage("Order placed successfully!", "*");
            });
          } else {
            Swal.fire({
              title: "Order Rejected",
              text: "Your payment method is rejected. Please retry with alternate payment method",
              icon: "error",
              position: "top",
            });
          }
        },
        (err) => {
          this.loading = false;
          Swal.fire({
            title: "Order Rejected",
            text: "Your payment method is rejected. Please retry with alternate payment method",
            icon: "error",
            position: "top",
          });
        }
      );
    } else {
      this.commonService.openErrorSnackBar("Upload PO to continue", "");
    }
  }

  payByInvoice() {
    // if (this.uploadedCreditApplication) {
    if (this.creditApprovalCode) {
      $("#submit-button").remove();
      let formData = new FormData();
      // formData.append('file', this.uploadedCreditApplication)
      this.checkoutObj["billingAddress"] = this.billingAddress;
      this.checkoutObj["shippingAddress"] = this.shippingAddress;
      this.checkoutObj["taxAmount"] = this.taxObject.totalTax;
      this.checkoutObj["taxSummary"] = this.taxObject.summary;
      const orderJson = {
        amount: (
          this.checkoutObj.totalPrice +
          this.selectedShippingMethod.price +
          this.taxObject.totalTax
        ).toFixed(2),
        subTotal: this.checkoutObj.totalPrice,
        shippingAmount: this.selectedShippingMethod.price,
        orderItem: this.checkoutObj,
        paymentType: this.paymentMethod,
        creditApprovalCode: this.creditApprovalCode,
      };
      formData.append("orderJson", JSON.stringify(orderJson));
      this.loading = true;
      this.storeService.createOrder(formData).subscribe(
        (res) => {
          this.loading = false;
          if (res.statusCode == 200) {
            Swal.fire({
              title: "Order Placed",
              text: `Your Credit Application has been received. 
                   You will be notified once the credit is approved by our team.
                   Your order details can be found in your “Order History” online at Areswear.com`,
              icon: "success",
              position: "top",
            }).then(() => {
              this.router.navigate(["/enduser/useraccount/orderhistory"]);
              // window.parent.postMessage("Order placed successfully!", "*");
            });
          } else {
            Swal.fire({
              title: "Order Rejected",
              text: "Your payment method is rejected. Please retry with alternate payment method",
              icon: "error",
              position: "top",
            });
          }
        },
        (err) => {
          this.loading = false;
          Swal.fire({
            title: "Order Rejected",
            text: "Your payment method is rejected. Please retry with alternate payment method",
            icon: "error",
            position: "top",
          });
        }
      );
    } else {
      this.commonService.openWarningSnackBar(
        "Please enter the credit application code ",
        ""
      );
    }
  }

  getStates() {
    this.endUserService.getAllStates().subscribe((res) => {
      this.states = res.data;
      this.getTax();
      this.replaceStateId();
    });
  }

  replaceStateId() {
    this.billingAddress.state =
      this.getState(this.billingAddress.state).name ||
      this.billingAddress.state;
    this.shippingAddress.state =
      this.getState(this.shippingAddress.state).name ||
      this.shippingAddress.state;
    this.validateAddress();
  }

  getState(id) {
    if (this.states.length) {
      let foundState = this.states.find(
        (state) => Number(state.id) == Number(id)
      );
      if (foundState) return foundState;
      else return {};
    } else {
      return {};
    }
  }

  initPaymentUI() {
    let button: HTMLButtonElement = document.querySelector("#submit-button");
    this.storeService.getClientAuth().subscribe((res) => {
      const clientAuth = res.data;
      dropin
        .create({
          authorization: clientAuth,
          selector: "#dropin-container",
        })
        .then((instance) => {
          this.INSTANCE = instance;
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  }

  getServiceName(serviceId) {
    if (serviceId && this.serviceArray.length)
      return this.serviceArray.find((s) => {
        return s.id == serviceId;
      }).name;
    return "";
  }

  getAvailableStoreServices() {
    this.storeService.getAvailableStoreServices().subscribe((response) => {
      this.serviceArray = response.data;
    });
  }

  getPersonalizationPrice(id) {
    switch (id) {
      case 0:
        return 0;
      case 1:
        return 7;
      case 2:
        return 6;
      case 3:
        return 13;
      default:
        return 0;
    }
  }

  validateCardNumber() {
    this.cardInfo.get("cardNumber").markAllAsTouched();
    if (this.isCreditCard() && this.checkLuhn()) {
      return true;
    } else {
      return false;
    }
  }

  validateCardDetails() {
    if (
      this.cardInfo.valid &&
      this.cardInfo.get("cardCode").value.toString().length >= 3
    ) {
      let month = this.cardInfo.get("expMonth").value;
      let year = this.cardInfo.get("expYear").value;
      let valid = true;
      if (year < new Date().getFullYear()) {
        valid = false;
      } else if (
        year == new Date().getFullYear() &&
        Number(month) < Number(new Date().getMonth() + 1)
      ) {
        valid = false;
      }

      if (!valid) this.commonService.openErrorSnackBar("Card is expired", "");
      else return this.validateCardNumber();

      return valid;
    } else {
      if (this.cardInfo.get("cardNumber").invalid) {
        this.commonService.openErrorSnackBar("Invalid card number", "");
      } else if (
        this.cardInfo.get("cardCode").invalid ||
        this.cardInfo.get("cardCode").value.toString().length < 3
      ) {
        this.commonService.openErrorSnackBar("Invalid CVV", "");
      } else {
        let month = this.cardInfo.get("expMonth").value;
        let year = this.cardInfo.get("expYear").value;
        if (month == 0 || year == 0) {
          this.commonService.openErrorSnackBar("Select Expiration Date", "");
        }
      }
      this.cardInfo.markAllAsTouched();
      return false;
    }
  }

  checkLuhn() {
    let cardNo = this.cardInfo.value.cardNumber;
    let nDigits = cardNo.length;
    let nSum = 0;
    let isSecond = false;
    for (let i = nDigits - 1; i >= 0; i--) {
      let d = Number(cardNo[i]);

      if (isSecond == true) d = d * 2;

      if (d > 9) d = (d % 10) + d / 10;

      nSum += d;
      isSecond = !isSecond;
    }
    if (nSum % 10 == 0) {
      return true;
    } else {
      this.commonService.openErrorSnackBar("Invalid Credit Card", "");
      return false;
    }
  }

  isCreditCard() {
    let cardNo = this.cardInfo.value.cardNumber;
    const regexp =
      /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;

    if (regexp.test(cardNo)) {
      return true;
    } else {
      this.commonService.openErrorSnackBar("Invalid Credit Card", "");
      return false;
    }
  }

  onCreditCardKeyDown(event) {
    let length = 15;
    const cardPrefix = this.cardInfo.value.cardNumber
      ? Number(this.cardInfo.value.cardNumber.toString().substring(0, 2))
      : null;
    if (cardPrefix) {
      loop1: for (let key in this.availableCards) {
        loop2: for (let prefix of this.availableCards[key].prefix) {
          if (this.cardInfo.value.cardNumber.toString().startsWith(prefix)) {
            length = this.availableCards[key].length;
            break loop1;
          }
        }
      }
    }
    if ([".", "+", "-", "e"].indexOf(event.key) >= 0) return false;
    else if (Number(event.key) != NaN && Number(event.key) <= 9)
      return event.target.value.toString().length >= length ? false : true;
    else return true;
  }

  onCVVKeyDown(event) {
    let length = 3;
    const cvv = Number(event.key);
    const cardPrefix = this.cardInfo.value.cardNumber
      ? Number(this.cardInfo.value.cardNumber.toString().substring(0, 2))
      : null;
    if (cardPrefix && this.availableCards.AE.prefix.indexOf(cardPrefix) != -1) {
      length = 4;
    }
    if (cvv && cvv <= 9)
      return event.target.value.length >= length ? false : true;
    else return true;
  }

  getBoxNames() {
    let str = "";
    this.checkoutObj.shippingBoxes.forEach((el) => {
      str += el.name + ", ";
    });
    return str.substr(0, str.length - 2);
  }

  validateAddress() {
    if (!this.shippingAddress.address) return;

    this.shippingAddress["country"] = "US";
    this.sharedService
      .validateAddress(this.shippingAddress).subscribe((res) => {
        if (res.data.validAddressIndicator) {
          this.shippingAddress["validAddressIndicator"] = true;
        } else {
          this.shippingAddress["validAddressIndicator"] = false;
          // this.commonService.openErrorSnackBar("Invalid Shipping Address", "")
        }
      });

    if (!this.billingAddress.address) return;

    this.billingAddress["country"] = "US";
    this.sharedService.validateAddress(this.billingAddress).subscribe((res) => {
      if (res.data.validAddressIndicator) {
        this.billingAddress["validAddressIndicator"] = true;
      } else {
        this.billingAddress["validAddressIndicator"] = false;
        // this.commonService.openErrorSnackBar("Invalid Billing Address", "")
      }
    });
  }

  backToCart(){
    this.router.navigateByUrl("/enduser/cart")
  }
}
