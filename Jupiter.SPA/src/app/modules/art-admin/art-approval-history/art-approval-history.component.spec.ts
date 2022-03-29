import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtApprovalHistoryComponent } from './art-approval-history.component';

describe('ArtApprovalHistoryComponent', () => {
  let component: ArtApprovalHistoryComponent;
  let fixture: ComponentFixture<ArtApprovalHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtApprovalHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtApprovalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
