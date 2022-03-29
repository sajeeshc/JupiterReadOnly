import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStoreListComponent } from './all-store-list.component';

describe('AllStoreListComponent', () => {
  let component: AllStoreListComponent;
  let fixture: ComponentFixture<AllStoreListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllStoreListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllStoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
