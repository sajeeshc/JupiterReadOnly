import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBrandingComponent } from './store-branding.component';

describe('StoreBrandingComponent', () => {
  let component: StoreBrandingComponent;
  let fixture: ComponentFixture<StoreBrandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreBrandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreBrandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
