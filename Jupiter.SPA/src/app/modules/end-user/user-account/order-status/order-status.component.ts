import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {

  public counts = ["Shipping soon","Shipped","On the way",
  "Out for delivery","Delivered"];
  public orderStatus = "Shipped"

  constructor() { }

  ngOnInit() {
  }
  

}
