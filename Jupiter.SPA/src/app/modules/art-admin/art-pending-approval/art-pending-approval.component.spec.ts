import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtPendingApprovalComponent } from './art-pending-approval.component';

describe('ArtPendingApprovalComponent', () => {
  let component: ArtPendingApprovalComponent;
  let fixture: ComponentFixture<ArtPendingApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtPendingApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtPendingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
