import { TestBed } from '@angular/core/testing';

import { OrdersReportsService } from './orders-reports.service';

describe('OrdersReportsService', () => {
  let service: OrdersReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
