/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StoreCartService } from './storeCart.service';

describe('Service: StoreCart', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreCartService]
    });
  });

  it('should ...', inject([StoreCartService], (service: StoreCartService) => {
    expect(service).toBeTruthy();
  }));
});
