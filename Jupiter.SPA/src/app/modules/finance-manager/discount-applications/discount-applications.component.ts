import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FinanceManagerService } from 'src/app/core/services/finance-manager.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-discount-applications',
  templateUrl: './discount-applications.component.html',
  styleUrls: ['./discount-applications.component.scss']
})
export class DiscountApplicationsComponent implements OnInit {

  constructor(
    private finManService: FinanceManagerService,
    private commonService: CommonService,
    private router: Router,
  ) { }

  filterParamsOrders = {
    customerName: '',
    customerEmail: '',
    organization: '',
    productId: '',
    productName: '',
    referenceId: '',
    page: 1,
    per_page: 10,
    pageSizeOptions: [5, 10, 25, 100],
    totalLength: 0
  }
  orders: any[];
  displayedColumns_Orders: string[] = [
    "customerName",
    "emailId",
    "organizationName",
    "productId",
    "productName",
    "referenceId",
    "originalProductCost",
    "sellingPrice",
    "discount",
    "action"
  ];

  filterParamsStores = {
    accountManagerName: '',
    teamStoreId: '',
    teamStoreName: '',
    customerName: '',
    emailId: '',
    submittedDate: '',
    teamStoreOpenDate: '',
    teamStoreCloseDate: '',
    page: 1,
    per_page: 10,
    pageSizeOptions: [5, 10, 25, 100],
    totalLength: 0
  }
  stores: any[];
  displayedColumns_Stores: string[] = [
    "accountManagerName",
    "teamStoreId",
    "teamStoreName",
    "customerName",
    "emailId",
    "submittedDate",
    "teamStoreOpenDate",
    "teamStoreCloseDate",
    "action"
  ];

  ngOnInit() {
    this.commonService.setPageHeader("Discount Applications")
    this.getPendingDiscountApplications()
    this.getPendingStoreDiscountApplications()
  }

  getPendingDiscountApplications() {
    this.finManService.getPendingDiscountApplications(this.filterParamsOrders).subscribe((res: any) => {
      this.orders = res.body.data
      this.filterParamsOrders.totalLength = JSON.parse(res.headers.get("Pagination")).totalItems || 0
    })
  }

  getPendingStoreDiscountApplications() {
    this.finManService.getPendingStoreDiscountApplications(this.filterParamsStores).subscribe((res: any) => {
      this.stores = res.body.data
      this.filterParamsStores.totalLength = JSON.parse(res.headers.get("Pagination")).totalItems || 0
    })
  }

  approveDiscountApplication(element, i) {
    const data = {
      referenceId: element.referenceId,
      productId: element.productId,
      value: 1,
      rejectionReason: "approved",
      cartId: element.cartId,
    }
    this.finManService.updateDiscountApplication(data).subscribe((res: any) => {
      this.orders = this.orders.filter(ele => ele.referenceId != element.referenceId)
      this.commonService.openSuccessSnackBar("Discount approved successfully", "")
    })
  }

  rejectDiscountApplication(element, i) {
    let data = {
      referenceId: element.referenceId,
      productId: element.productId,
      value: 2,
      rejectionReason: "rejected",
      cartId: element.cartId,
    }
    Swal.fire({
      input: 'textarea',
      inputLabel: 'Rejection Notes',
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    }).then(result => {
      if (result.isConfirmed) {
        data.rejectionReason = result.value
        this.finManService.updateDiscountApplication(data).subscribe((res: any) => {
          this.orders = this.orders.filter(ele => ele.referenceId != element.referenceId)
          this.commonService.openSuccessSnackBar("Discount rejected successfully", "")
        })
      }
    })
  }

  gotoStoreDiscountApplication(storeId, i){
    this.router.navigateByUrl("financemanager/discountapplications/store/"+storeId)
  }

  onPageOrders(event) {
    this.filterParamsOrders.per_page = event.pageSize
    this.filterParamsOrders.page = event.pageIndex + 1
    this.getPendingDiscountApplications()
  }

  onPageStores(event) {
    this.filterParamsOrders.per_page = event.pageSize
    this.filterParamsOrders.page = event.pageIndex + 1
    this.getPendingStoreDiscountApplications()
  }
}
