import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtProcessComponent } from './art-process.component';

describe('ArtProcessComponent', () => {
  let component: ArtProcessComponent;
  let fixture: ComponentFixture<ArtProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
