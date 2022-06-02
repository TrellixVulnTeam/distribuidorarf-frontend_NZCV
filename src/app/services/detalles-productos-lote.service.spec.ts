import { TestBed } from '@angular/core/testing';

import { DetallesProductosLoteService } from './detalles-productos-lote.service';

describe('DetallesProductosLoteService', () => {
  let service: DetallesProductosLoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallesProductosLoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
