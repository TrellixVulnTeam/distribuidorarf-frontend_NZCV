import { TestBed } from '@angular/core/testing';

import { GaleriaProductosService } from './galeria-productos.service';

describe('GaleriaProductosService', () => {
  let service: GaleriaProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GaleriaProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
