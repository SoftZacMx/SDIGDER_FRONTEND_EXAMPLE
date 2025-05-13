import { TestBed } from '@angular/core/testing';

import { SaourcesService } from './saources.service';

describe('SaourcesService', () => {
  let service: SaourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
