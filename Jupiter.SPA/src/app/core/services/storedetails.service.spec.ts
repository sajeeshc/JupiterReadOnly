import { TestBed } from '@angular/core/testing';

import { StoredetailsService } from './storedetails.service';

describe('StoredetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoredetailsService = TestBed.get(StoredetailsService);
    expect(service).toBeTruthy();
  });
});
