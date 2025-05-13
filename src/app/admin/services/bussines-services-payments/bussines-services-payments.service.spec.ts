import { TestBed } from '@angular/core/testing';

import { BussinesServicesPaymentsService } from './bussines-services-payments.service';

describe('BussinesServicesPaymentsService', () => {
  let service: BussinesServicesPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BussinesServicesPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
