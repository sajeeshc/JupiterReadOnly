import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProductCategoriesComponent } from './store-product-categories.component';

describe('StoreProductCategoriesComponent', () => {
  let component: StoreProductCategoriesComponent;
  let fixture: ComponentFixture<StoreProductCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreProductCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreProductCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
