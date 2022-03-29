import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreOrderStatusComponent } from './store-order-status.component';

describe('StoreOrderStatusComponent', () => {
  let component: StoreOrderStatusComponent;
  let fixture: ComponentFixture<StoreOrderStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreOrderStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
