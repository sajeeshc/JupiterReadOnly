import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestFreeStoreComponent } from './request-free-store.component';

describe('RequestFreeStoreComponent', () => {
  let component: RequestFreeStoreComponent;
  let fixture: ComponentFixture<RequestFreeStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestFreeStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestFreeStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
