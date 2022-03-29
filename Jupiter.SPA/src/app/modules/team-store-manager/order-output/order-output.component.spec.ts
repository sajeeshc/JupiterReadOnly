import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderOutputComponent } from './order-output.component';

describe('OrderOutputComponent', () => {
  let component: OrderOutputComponent;
  let fixture: ComponentFixture<OrderOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
