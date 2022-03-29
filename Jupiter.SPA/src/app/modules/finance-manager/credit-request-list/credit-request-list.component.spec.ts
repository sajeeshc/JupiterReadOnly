import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditRequestListComponent } from './credit-request-list.component';

describe('CreditRequestListComponent', () => {
  let component: CreditRequestListComponent;
  let fixture: ComponentFixture<CreditRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
