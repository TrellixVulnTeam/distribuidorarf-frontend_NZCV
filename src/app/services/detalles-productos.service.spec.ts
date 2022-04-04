import { TestBed } from '@angular/core/testing';

import { DetallesProductosService } from './detalles-productos.service';

describe('DetallesProductosService', () => {
  let service: DetallesProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallesProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
