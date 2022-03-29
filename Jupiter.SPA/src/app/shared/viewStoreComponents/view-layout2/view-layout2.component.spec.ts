import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLayout2Component } from './view-layout2.component';

describe('ViewLayout2Component', () => {
  let component: ViewLayout2Component;
  let fixture: ComponentFixture<ViewLayout2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLayout2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLayout2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
