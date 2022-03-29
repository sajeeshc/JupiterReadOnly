import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCategoryComponent } from './set-category.component';

describe('SetCategoryComponent', () => {
  let component: SetCategoryComponent;
  let fixture: ComponentFixture<SetCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
