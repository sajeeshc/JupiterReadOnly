import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProductdisplayComponent } from './store-productdisplay.component';

describe('StoreProductdisplayComponent', () => {
  let component: StoreProductdisplayComponent;
  let fixture: ComponentFixture<StoreProductdisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreProductdisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreProductdisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
