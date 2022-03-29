import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtAdminComponent } from './art-admin.component';

describe('ArtAdminComponent', () => {
  let component: ArtAdminComponent;
  let fixture: ComponentFixture<ArtAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
