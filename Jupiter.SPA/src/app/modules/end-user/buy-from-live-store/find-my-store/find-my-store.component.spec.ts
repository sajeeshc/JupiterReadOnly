import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMyStoreComponent } from './find-my-store.component';

describe('FindMyStoreComponent', () => {
  let component: FindMyStoreComponent;
  let fixture: ComponentFixture<FindMyStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindMyStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindMyStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
