import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamStoreManagerComponent } from './team-store-manager.component';

describe('TeamStoreManagerComponent', () => {
  let component: TeamStoreManagerComponent;
  let fixture: ComponentFixture<TeamStoreManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamStoreManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamStoreManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
