import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtQueuelistComponent } from './art-queuelist.component';

describe('ArtQueuelistComponent', () => {
  let component: ArtQueuelistComponent;
  let fixture: ComponentFixture<ArtQueuelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtQueuelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtQueuelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
