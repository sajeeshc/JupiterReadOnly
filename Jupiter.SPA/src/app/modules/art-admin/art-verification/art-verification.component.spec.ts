import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtVerificationComponent } from './art-verification.component';

describe('ArtVerificationComponent', () => {
  let component: ArtVerificationComponent;
  let fixture: ComponentFixture<ArtVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
