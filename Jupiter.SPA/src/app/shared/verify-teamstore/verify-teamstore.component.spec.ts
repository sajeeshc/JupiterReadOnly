import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyTeamstoreComponent } from './verify-teamstore.component';

describe('VerifyTeamstoreComponent', () => {
  let component: VerifyTeamstoreComponent;
  let fixture: ComponentFixture<VerifyTeamstoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyTeamstoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyTeamstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
