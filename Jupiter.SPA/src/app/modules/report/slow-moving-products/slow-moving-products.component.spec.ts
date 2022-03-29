import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlowMovingProductsComponent } from './slow-moving-products.component';

describe('SlowMovingProductsComponent', () => {
  let component: SlowMovingProductsComponent;
  let fixture: ComponentFixture<SlowMovingProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlowMovingProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlowMovingProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
