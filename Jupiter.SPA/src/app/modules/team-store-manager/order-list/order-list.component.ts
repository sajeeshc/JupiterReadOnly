import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreManagerService } from 'src/app/core/services/store-manager.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private storeManagerService : StoreManagerService) { }

    orderList : any[] = [];
    filterFormGroup: FormGroup;
    displayedColumns: string[] = [
      "orderId",
      "customerName",
      "instituitionName",
      "email",
      "storeName",
      "orderType",
      "orderDate"
    ];
    customerSearch = '';
    orderIdSearch = '';
    instituteSearch = '';
    customerEmailSearch = '';
    customerPhoneSearch = '';
  ngOnInit() {
    this.createFilterFormGroup(); 
    this.getOrderList();
  }

  createFilterFormGroup () {
    this.filterFormGroup = this.formBuilder.group({
      startDate : new FormControl(''),
      endDate : new FormControl(''),
      orderType : new FormControl(0),
      paymentMode : new FormControl(0)
    });
  }

  getOrderList () {
    var datePipe = new DatePipe('en-US');
    var startDate = datePipe.transform(this.filterFormGroup.get('startDate').value, 'MM/dd/yyyy');
    var endDate = datePipe.transform(this.filterFormGroup.get('endDate').value, 'MM/dd/yyyy');
    startDate = startDate == null ? '' : startDate;
    endDate = endDate == null ? '' : endDate;
    var orderType = this.filterFormGroup.get('orderType').value  == null ? '' : this.filterFormGroup.get('orderType').value;
    var paymentMode = this.filterFormGroup.get('paymentMode').value  == null ? '' : this.filterFormGroup.get('paymentMode').value;
    const params = {
      orderId:this.orderIdSearch,
      customerName:this.customerSearch,
      institution:this.instituteSearch,
      customerEmail:this.customerEmailSearch,
      customerPhone:this.customerPhoneSearch,
      startDate,endDate,orderType,paymentMode
    }
    this.storeManagerService.getOrderList(params).subscribe(response => {
      if (response != null) {
        this.orderList = response.body.data;
      }
      else {
        this.orderList = [];
        this.commonService.openErrorSnackBar(response.message,'');
      }
    });
  }

  redirectToOrderSummary(item){
    this.router.navigateByUrl('/storemanager/orderdetails/'+item.orderId)
  }
}
