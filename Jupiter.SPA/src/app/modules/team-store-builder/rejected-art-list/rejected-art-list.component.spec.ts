import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedArtListComponent } from './rejected-art-list.component';

describe('RejectedArtListComponent', () => {
  let component: RejectedArtListComponent;
  let fixture: ComponentFixture<RejectedArtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedArtListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedArtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
