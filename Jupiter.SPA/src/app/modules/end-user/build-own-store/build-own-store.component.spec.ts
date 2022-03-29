import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildOwnStoreComponent } from './build-own-store.component';

describe('BuildOwnStoreComponent', () => {
  let component: BuildOwnStoreComponent;
  let fixture: ComponentFixture<BuildOwnStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildOwnStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildOwnStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
