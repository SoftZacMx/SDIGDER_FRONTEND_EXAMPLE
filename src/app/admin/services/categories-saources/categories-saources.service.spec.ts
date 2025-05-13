import { TestBed } from '@angular/core/testing';

import { CategoriesSaourcesService } from './categories-saources.service';

describe('CategoriesSaourcesService', () => {
  let service: CategoriesSaourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesSaourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
