import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedStoreListComponent } from './suggested-store-list.component';

describe('SuggestedStoreListComponent', () => {
  let component: SuggestedStoreListComponent;
  let fixture: ComponentFixture<SuggestedStoreListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedStoreListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedStoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
