import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedTemplateComponent } from './suggested-template.component';

describe('SuggestedTemplateComponent', () => {
  let component: SuggestedTemplateComponent;
  let fixture: ComponentFixture<SuggestedTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
