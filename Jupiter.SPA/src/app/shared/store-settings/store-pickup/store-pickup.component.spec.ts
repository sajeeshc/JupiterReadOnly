import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePickupComponent } from './store-pickup.component';

describe('StorePickupComponent', () => {
  let component: StorePickupComponent;
  let fixture: ComponentFixture<StorePickupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorePickupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorePickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
