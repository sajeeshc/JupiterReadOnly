import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreLiveComponent } from './store-live.component';

describe('StoreLiveComponent', () => {
  let component: StoreLiveComponent;
  let fixture: ComponentFixture<StoreLiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreLiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
