import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkOrderEntryListComponent } from './bulk-order-entry-list.component';

describe('BulkOrderEntryListComponent', () => {
  let component: BulkOrderEntryListComponent;
  let fixture: ComponentFixture<BulkOrderEntryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkOrderEntryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkOrderEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
