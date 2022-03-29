import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSpecificationComponent } from './store-specification.component';

describe('StoreSpecificationComponent', () => {
  let component: StoreSpecificationComponent;
  let fixture: ComponentFixture<StoreSpecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreSpecificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
