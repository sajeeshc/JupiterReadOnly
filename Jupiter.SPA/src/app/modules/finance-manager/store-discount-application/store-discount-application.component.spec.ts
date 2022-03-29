import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDiscountApplicationComponent } from './store-discount-application.component';

describe('StoreDiscountApplicationComponent', () => {
  let component: StoreDiscountApplicationComponent;
  let fixture: ComponentFixture<StoreDiscountApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreDiscountApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreDiscountApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
