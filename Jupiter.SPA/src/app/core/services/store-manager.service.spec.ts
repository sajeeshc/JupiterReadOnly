import { TestBed } from '@angular/core/testing';

import { StoreManagerService } from './store-manager.service';

describe('StoreManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreManagerService = TestBed.get(StoreManagerService);
    expect(service).toBeTruthy();
  });
});
