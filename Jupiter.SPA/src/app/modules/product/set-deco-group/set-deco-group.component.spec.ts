import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDecoGroupComponent } from './set-deco-group.component';

describe('SetDecoGroupComponent', () => {
  let component: SetDecoGroupComponent;
  let fixture: ComponentFixture<SetDecoGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetDecoGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDecoGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
