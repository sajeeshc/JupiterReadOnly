import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreStyleEditorComponent } from './store-style-editor.component';

describe('StoreStyleEditorComponent', () => {
  let component: StoreStyleEditorComponent;
  let fixture: ComponentFixture<StoreStyleEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreStyleEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreStyleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
