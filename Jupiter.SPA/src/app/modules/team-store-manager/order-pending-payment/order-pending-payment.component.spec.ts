import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPendingPaymentComponent } from './order-pending-payment.component';

describe('OrderPendingPaymentComponent', () => {
  let component: OrderPendingPaymentComponent;
  let fixture: ComponentFixture<OrderPendingPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPendingPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPendingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
