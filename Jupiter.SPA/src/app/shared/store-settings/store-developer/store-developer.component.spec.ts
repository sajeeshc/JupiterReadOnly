import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDeveloperComponent } from './store-developer.component';

describe('StoreDeveloperComponent', () => {
  let component: StoreDeveloperComponent;
  let fixture: ComponentFixture<StoreDeveloperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreDeveloperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
