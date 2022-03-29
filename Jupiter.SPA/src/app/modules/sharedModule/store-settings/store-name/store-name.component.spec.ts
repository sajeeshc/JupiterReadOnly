import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreNameComponent } from './store-name.component';

describe('StoreNameComponent', () => {
  let component: StoreNameComponent;
  let fixture: ComponentFixture<StoreNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
