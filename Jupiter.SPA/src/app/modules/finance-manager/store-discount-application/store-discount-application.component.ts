import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { FinanceManagerService } from 'src/app/core/services/finance-manager.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-store-discount-application',
  templateUrl: './store-discount-application.component.html',
  styleUrls: ['./store-discount-application.component.scss']
})
export class StoreDiscountApplicationComponent implements OnInit {

  storeId = 0

  constructor(
    private finManService: FinanceManagerService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  dataSource: any[];
  displayedColumns: string[] = [
    "garmentId",
    "garmentName",
    "color",
    "basePrice",
    "decoPrice",
    "fundRaisingAmount",
    "discountRequested",
    "totalAmount",
    "newTotalAmount",
    "action"
  ];

  ngOnInit() {
    console.log(this.route.snapshot.params)
    this.storeId = this.route.snapshot.params["id"]
    this.getPendingStoreDiscountApplications()
  }

  getPendingStoreDiscountApplications() {
    const params = { per_page: 0 }
    this.finManService.getDiscountApplicationByStoreId(this.storeId).subscribe((res: any) => {
      this.dataSource = res.data
    })
  }

  updateDiscountStatus(id,approve){
    let data = {
      id,
      value:approve ? 2 : 3,
      rejectionReason:""
    }
    if(approve){
      Swal.fire({
        icon:'info',
        title:'Are you sure!',
        text:'Do you want to approve this discount ?',
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      }).then(result=>{
        if(result.isConfirmed){
          this.finManService.updateStoreDiscountStatus(data).subscribe(res=>{
            this.dataSource = this.dataSource.filter(ele => ele.id != id)
            this.commonService.openSuccessSnackBar("Discount approved successfully", "")
          })
        }
      })
    }else{
      Swal.fire({
        input: 'textarea',
        inputLabel: 'Rejection Notes',
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
      }).then(result => {
        if (result.isConfirmed) {
          data['rejectionReason'] = result.value
          this.finManService.updateStoreDiscountStatus(data).subscribe(res=>{
            this.dataSource = this.dataSource.filter(ele => ele.id != id)
            this.commonService.openSuccessSnackBar("Discount rejected successfully", "")
          })
        }
      })
    }
    
  }
}
