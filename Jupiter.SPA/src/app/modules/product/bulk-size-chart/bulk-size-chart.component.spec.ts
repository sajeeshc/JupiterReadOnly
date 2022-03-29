import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSizeChartComponent } from './bulk-size-chart.component';

describe('BulkSizeChartComponent', () => {
  let component: BulkSizeChartComponent;
  let fixture: ComponentFixture<BulkSizeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkSizeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSizeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
