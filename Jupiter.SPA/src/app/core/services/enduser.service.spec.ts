import { TestBed } from '@angular/core/testing';

import { EnduserService } from './enduser.service';

describe('EnduserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnduserService = TestBed.get(EnduserService);
    expect(service).toBeTruthy();
  });
});
