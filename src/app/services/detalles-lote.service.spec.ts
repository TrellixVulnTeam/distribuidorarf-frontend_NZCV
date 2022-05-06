import { TestBed } from '@angular/core/testing';

import { DetallesLoteService } from './detalles-lote.service';

describe('DetallesLoteService', () => {
  let service: DetallesLoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallesLoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
