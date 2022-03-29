import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtQueueListComponent } from './art-queue-list.component';

describe('ArtQueueListComponent', () => {
  let component: ArtQueueListComponent;
  let fixture: ComponentFixture<ArtQueueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtQueueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtQueueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
