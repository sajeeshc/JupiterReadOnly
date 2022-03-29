import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtAdminDashboardComponent } from './art-admin-dashboard.component';

describe('ArtAdminDashboardComponent', () => {
  let component: ArtAdminDashboardComponent;
  let fixture: ComponentFixture<ArtAdminDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtAdminDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
