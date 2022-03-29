import { Component, OnInit } from '@angular/core';
import { EnduserService } from 'src/app/core/services/enduser.service'
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  constructor(private enduserService: EnduserService) { }

  noImage = "../../../../../assets/images/default-image.jpg"
  orderStatus: any = { 'other': "", '1': "Payment Pending", '2': "Order Placed", '3': "Order Rejected" }
  paymentMode: any = { 'other': "", '1': "Invoice", '2': "PO", '3': "Card", '0': "Card" }
  counts = ["Shipping soon", "Shipped", "On the way", "Out for delivery", "Delivered"];
  tempOrderStatus = "Shipped"
  orders: any[]
  

  ngOnInit() {
    this.getOrderHistory()
  }

  getOrderHistory() {
    let params:_params = { page: 8, per_page: 10}
    this.enduserService.getOrders().subscribe(res => {
      if (res.statusCode == 200) {
        this.orders = res.data
      }
    })
  }
}

interface  _params {
  page: number,
  per_page: number
}