import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreVerificationComponent } from './store-verification.component';

describe('StoreVerificationComponent', () => {
  let component: StoreVerificationComponent;
  let fixture: ComponentFixture<StoreVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
