import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyFromLiveStoreComponent } from './buy-from-live-store.component';

describe('BuyFromLiveStoreComponent', () => {
  let component: BuyFromLiveStoreComponent;
  let fixture: ComponentFixture<BuyFromLiveStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyFromLiveStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyFromLiveStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
