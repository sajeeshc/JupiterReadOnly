import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtApprovalListComponent } from './art-approval-list.component';

describe('ArtApprovalListComponent', () => {
  let component: ArtApprovalListComponent;
  let fixture: ComponentFixture<ArtApprovalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtApprovalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
