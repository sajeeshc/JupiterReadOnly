import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtDirectorComponent } from './art-director.component';

describe('ArtDirectorComponent', () => {
  let component: ArtDirectorComponent;
  let fixture: ComponentFixture<ArtDirectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtDirectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
