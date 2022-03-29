import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerBannerTopComponent } from './disclaimer-banner-top.component';

describe('DisclaimerBannerTopComponent', () => {
  let component: DisclaimerBannerTopComponent;
  let fixture: ComponentFixture<DisclaimerBannerTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclaimerBannerTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclaimerBannerTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
