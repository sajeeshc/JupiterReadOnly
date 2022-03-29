import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadArtComponent } from './download-art.component';

describe('DownloadArtComponent', () => {
  let component: DownloadArtComponent;
  let fixture: ComponentFixture<DownloadArtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadArtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
