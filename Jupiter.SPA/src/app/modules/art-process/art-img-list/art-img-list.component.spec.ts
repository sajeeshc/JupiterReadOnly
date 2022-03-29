import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtImgListComponent } from './art-img-list.component';

describe('ArtImgListComponent', () => {
  let component: ArtImgListComponent;
  let fixture: ComponentFixture<ArtImgListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtImgListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtImgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
