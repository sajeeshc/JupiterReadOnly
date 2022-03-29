/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StoreClosedPageComponent } from './store-closed-page.component';

describe('StoreClosedPageComponent', () => {
  let component: StoreClosedPageComponent;
  let fixture: ComponentFixture<StoreClosedPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreClosedPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreClosedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
