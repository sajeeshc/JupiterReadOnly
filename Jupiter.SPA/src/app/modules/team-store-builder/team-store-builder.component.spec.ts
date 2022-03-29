import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamStoreBuilderComponent } from './team-store-builder.component';

describe('TeamStoreBuilderComponent', () => {
  let component: TeamStoreBuilderComponent;
  let fixture: ComponentFixture<TeamStoreBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamStoreBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamStoreBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
