import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderArtDetailComponent } from './order-art-detail.component';

describe('OrderArtDetailComponent', () => {
  let component: OrderArtDetailComponent;
  let fixture: ComponentFixture<OrderArtDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderArtDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderArtDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
