import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingChargeUpdateRequestListComponent } from './shipping-charge-update-request-list.component';

describe('ShippingChargeUpdateRequestListComponent', () => {
  let component: ShippingChargeUpdateRequestListComponent;
  let fixture: ComponentFixture<ShippingChargeUpdateRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingChargeUpdateRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingChargeUpdateRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
