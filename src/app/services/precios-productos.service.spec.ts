import { TestBed } from '@angular/core/testing';

import { PreciosProductosService } from './precios-productos.service';

describe('PreciosProductosService', () => {
  let service: PreciosProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreciosProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
