import { TestBed } from '@angular/core/testing';

import { BussinesServicesService } from './bussines-services.service';

describe('BussinesServicesService', () => {
  let service: BussinesServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BussinesServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
