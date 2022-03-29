import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDashoardComponent } from './product-dashoard.component';

describe('ProductDashoardComponent', () => {
  let component: ProductDashoardComponent;
  let fixture: ComponentFixture<ProductDashoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDashoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDashoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
