import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStoreRequestComponent } from './create-store-request.component';

describe('CreateStoreRequestComponent', () => {
  let component: CreateStoreRequestComponent;
  let fixture: ComponentFixture<CreateStoreRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStoreRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStoreRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
