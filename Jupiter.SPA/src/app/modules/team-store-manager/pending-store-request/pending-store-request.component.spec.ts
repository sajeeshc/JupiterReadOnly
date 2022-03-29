import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingStoreRequestComponent } from './pending-store-request.component';

describe('PendingStoreRequestComponent', () => {
  let component: PendingStoreRequestComponent;
  let fixture: ComponentFixture<PendingStoreRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingStoreRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingStoreRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
