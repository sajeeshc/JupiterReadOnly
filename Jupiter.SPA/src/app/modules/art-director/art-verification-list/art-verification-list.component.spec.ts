import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtVerificationListComponent } from './art-verification-list.component';

describe('ArtVerificationListComponent', () => {
  let component: ArtVerificationListComponent;
  let fixture: ComponentFixture<ArtVerificationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtVerificationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtVerificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
