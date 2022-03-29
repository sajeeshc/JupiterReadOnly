import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoGroupComponent } from './deco-group.component';

describe('DecoGroupComponent', () => {
  let component: DecoGroupComponent;
  let fixture: ComponentFixture<DecoGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecoGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecoGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
