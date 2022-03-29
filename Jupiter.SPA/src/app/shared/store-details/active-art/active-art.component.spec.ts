import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveArtComponent } from './active-art.component';

describe('ActiveArtComponent', () => {
  let component: ActiveArtComponent;
  let fixture: ComponentFixture<ActiveArtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveArtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
