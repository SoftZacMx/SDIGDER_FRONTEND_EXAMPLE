import { TestBed } from '@angular/core/testing';

import { ExportSalesReportService } from './export-sales-report.service';

describe('ExportSalesReportService', () => {
  let service: ExportSalesReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportSalesReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
