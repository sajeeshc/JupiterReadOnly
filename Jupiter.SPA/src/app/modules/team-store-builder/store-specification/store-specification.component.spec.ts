import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorespecificationComponent } from './store-specification.component';

describe('StorespecificationComponent', () => {
  let component: StorespecificationComponent;
  let fixture: ComponentFixture<StorespecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorespecificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorespecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
