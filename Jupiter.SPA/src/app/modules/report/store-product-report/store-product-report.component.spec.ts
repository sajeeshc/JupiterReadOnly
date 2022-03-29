import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProductReportComponent } from './store-product-report.component';

describe('StoreProductReportComponent', () => {
  let component: StoreProductReportComponent;
  let fixture: ComponentFixture<StoreProductReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreProductReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreProductReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
