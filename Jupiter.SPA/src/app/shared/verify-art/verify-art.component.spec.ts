import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyArtComponent } from './verify-art.component';

describe('VerifyArtComponent', () => {
  let component: VerifyArtComponent;
  let fixture: ComponentFixture<VerifyArtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyArtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
