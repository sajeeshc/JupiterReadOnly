import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreRequestManagementComponent } from './store-request-management.component';

describe('StoreRequestManagementComponent', () => {
  let component: StoreRequestManagementComponent;
  let fixture: ComponentFixture<StoreRequestManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreRequestManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
