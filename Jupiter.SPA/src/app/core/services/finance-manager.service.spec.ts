import { TestBed } from '@angular/core/testing';

import { FinanceManagerService } from './finance-manager.service';

describe('FinanceManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FinanceManagerService = TestBed.get(FinanceManagerService);
    expect(service).toBeTruthy();
  });
});
