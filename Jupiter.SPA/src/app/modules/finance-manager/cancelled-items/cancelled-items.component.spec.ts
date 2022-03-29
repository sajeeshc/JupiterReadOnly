import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledItemsComponent } from './cancelled-items.component';

describe('CancelledItemsComponent', () => {
  let component: CancelledItemsComponent;
  let fixture: ComponentFixture<CancelledItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelledItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelledItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
