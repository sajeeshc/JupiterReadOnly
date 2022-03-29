import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLayout1Component } from './view-layout1.component';

describe('ViewLayout1Component', () => {
  let component: ViewLayout1Component;
  let fixture: ComponentFixture<ViewLayout1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLayout1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLayout1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
