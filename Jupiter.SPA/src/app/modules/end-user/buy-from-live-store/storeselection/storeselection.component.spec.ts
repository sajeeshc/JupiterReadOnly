import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreselectionComponent } from './storeselection.component';

describe('StoreselectionComponent', () => {
  let component: StoreselectionComponent;
  let fixture: ComponentFixture<StoreselectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreselectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
