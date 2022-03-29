import { TestBed } from '@angular/core/testing';

import { StorebuilderService } from './storebuilder.service';

describe('StorebuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorebuilderService = TestBed.get(StorebuilderService);
    expect(service).toBeTruthy();
  });
});
