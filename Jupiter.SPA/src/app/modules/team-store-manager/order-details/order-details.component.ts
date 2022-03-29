import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreManagerService } from 'src/app/core/services/store-manager.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private storeManagerService : StoreManagerService) { }

    orderInfo : any; 
    orderId : any;

  ngOnInit() {
    this.orderId = parseInt(this.route.snapshot.paramMap.get("orderId")); 
    this.getOrderDetails();
  }

  getOrderDetails(){
    this.storeManagerService.getOrderDetails(this.orderId).subscribe(response => {
      this.orderInfo = response.body.data;
      console.log(this.orderInfo)
    }, error =>{

    })
  }

}
