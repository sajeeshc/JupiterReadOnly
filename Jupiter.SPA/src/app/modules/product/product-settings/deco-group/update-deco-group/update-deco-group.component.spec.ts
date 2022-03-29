import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDecoGroupComponent } from './update-deco-group.component';

describe('UpdateDecoGroupComponent', () => {
  let component: UpdateDecoGroupComponent;
  let fixture: ComponentFixture<UpdateDecoGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateDecoGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDecoGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
