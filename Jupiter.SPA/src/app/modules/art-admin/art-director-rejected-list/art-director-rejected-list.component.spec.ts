import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtDirectorRejectedListComponent } from './art-director-rejected-list.component';

describe('ArtDirectorRejectedListComponent', () => {
  let component: ArtDirectorRejectedListComponent;
  let fixture: ComponentFixture<ArtDirectorRejectedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtDirectorRejectedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtDirectorRejectedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
