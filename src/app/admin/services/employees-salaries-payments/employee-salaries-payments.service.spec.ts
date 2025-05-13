import { TestBed } from '@angular/core/testing';

import { EmployeeSalariesPaymentsService } from './employee-salaries-payments.service';

describe('EmployeeSalariesPaymentsService', () => {
  let service: EmployeeSalariesPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeSalariesPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
