import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoPositionsComponent } from './deco-positions.component';

describe('DecoPositionsComponent', () => {
  let component: DecoPositionsComponent;
  let fixture: ComponentFixture<DecoPositionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecoPositionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecoPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
