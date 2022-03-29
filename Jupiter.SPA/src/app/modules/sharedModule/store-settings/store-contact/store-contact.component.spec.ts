import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreContactComponent } from './store-contact.component';

describe('StoreContactComponent', () => {
  let component: StoreContactComponent;
  let fixture: ComponentFixture<StoreContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
