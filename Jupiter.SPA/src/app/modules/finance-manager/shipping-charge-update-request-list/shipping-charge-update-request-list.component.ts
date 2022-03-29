import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/core/services/common.service";
import { FinanceManagerService } from "src/app/core/services/finance-manager.service";

@Component({
  selector: "app-shipping-charge-update-request-list",
  templateUrl: "./shipping-charge-update-request-list.component.html",
  styleUrls: ["./shipping-charge-update-request-list.component.scss"],
})
export class ShippingChargeUpdateRequestListComponent implements OnInit {
  constructor(
    private commonService: CommonService,
    private finManService: FinanceManagerService
  ) {}

  dataSource = [];
  loading = false
  ngOnInit() {
    this.commonService.setPageHeader("Shipping Charge Update Requests");
    this.getRequestList();
  }

  getRequestList() {
    this.loading = true
    this.finManService.getShippingChargeUpdateRequests().subscribe((res) => {
      this.dataSource = res.body.data;
      this.loading = false
    },err=>{
      this.loading = false
    });
  }

  updateStatus(teamStoreId, individualShippingStatus) {
    //2 - RejectedArtListComponent, 3 - approve
    let el = document.getElementById(teamStoreId) as HTMLInputElement 
    let estimatedIndividualShippingCharge = el.value
    let data = {
      estimatedIndividualShippingCharge,
      individualShippingStatus,
      teamStoreId
    };
    this.finManService.updateShippingChargeRequestStatus(data).subscribe(res=>{
      if(individualShippingStatus == 2){
        this.commonService.openSuccessSnackBar("Request rejected","")
      } else {
        this.commonService.openSuccessSnackBar("Request approved","")
      }
      this.updateList(teamStoreId)
    })
  }

  updateList(teamStoreId){
    this.dataSource = this.dataSource.filter(row=>row.teamStoreId != teamStoreId)
  }
}
