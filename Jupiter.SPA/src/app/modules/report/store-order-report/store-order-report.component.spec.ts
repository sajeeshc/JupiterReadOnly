import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreOrderReportComponent } from './store-order-report.component';

describe('StoreOrderReportComponent', () => {
  let component: StoreOrderReportComponent;
  let fixture: ComponentFixture<StoreOrderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreOrderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
