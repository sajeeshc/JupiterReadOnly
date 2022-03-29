import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDomainComponent } from './store-domain.component';

describe('StoreDomainComponent', () => {
  let component: StoreDomainComponent;
  let fixture: ComponentFixture<StoreDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
