import { TestBed } from '@angular/core/testing';

import { PurchaseMerchandiseService } from './purchase-merchandise.service';

describe('PurchaseMerchandiseService', () => {
  let service: PurchaseMerchandiseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseMerchandiseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
