import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginCalcComponent } from './margin-calc.component';

describe('MarginCalcComponent', () => {
  let component: MarginCalcComponent;
  let fixture: ComponentFixture<MarginCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
