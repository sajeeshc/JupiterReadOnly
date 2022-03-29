import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyArtDetailComponent } from './verify-art-detail.component';

describe('VerifyArtDetailComponent', () => {
  let component: VerifyArtDetailComponent;
  let fixture: ComponentFixture<VerifyArtDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyArtDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyArtDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
