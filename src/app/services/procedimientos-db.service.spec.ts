import { TestBed } from '@angular/core/testing';

import { ProcedimientosDbService } from './procedimientos-db.service';

describe('ProcedimientosDbService', () => {
  let service: ProcedimientosDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcedimientosDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
