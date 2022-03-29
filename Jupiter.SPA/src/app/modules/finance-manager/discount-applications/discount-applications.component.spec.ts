import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountApplicationsComponent } from './discount-applications.component';

describe('DiscountApplicationsComponent', () => {
  let component: DiscountApplicationsComponent;
  let fixture: ComponentFixture<DiscountApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountApplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
