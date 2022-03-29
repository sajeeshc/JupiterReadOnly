import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreRequestlistComponent } from './store-request-list.component';

describe('StorerequestlistComponent', () => {
  let component: StoreRequestlistComponent;
  let fixture: ComponentFixture<StoreRequestlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreRequestlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreRequestlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
