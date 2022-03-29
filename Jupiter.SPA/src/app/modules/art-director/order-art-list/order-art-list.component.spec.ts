import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderArtListComponent } from './order-art-list.component';

describe('OrderArtListComponent', () => {
  let component: OrderArtListComponent;
  let fixture: ComponentFixture<OrderArtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderArtListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderArtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
