import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamStoreComponent } from './team-store.component';

describe('TeamStoreComponent', () => {
  let component: TeamStoreComponent;
  let fixture: ComponentFixture<TeamStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
