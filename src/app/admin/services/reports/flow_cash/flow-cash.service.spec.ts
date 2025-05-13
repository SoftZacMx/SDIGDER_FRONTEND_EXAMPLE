import { TestBed } from '@angular/core/testing';

import { FlowCashService } from './flow-cash.service';

describe('FlowCashService', () => {
  let service: FlowCashService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowCashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
