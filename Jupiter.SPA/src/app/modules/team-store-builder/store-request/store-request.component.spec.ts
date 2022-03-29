import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorerequestComponent } from './store-request.component';

describe('StorerequestComponent', () => {
  let component: StorerequestComponent;
  let fixture: ComponentFixture<StorerequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorerequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
