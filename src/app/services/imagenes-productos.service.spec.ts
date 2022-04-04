import { TestBed } from '@angular/core/testing';

import { ImagenesProductosService } from './imagenes-productos.service';

describe('ImagenesProductosService', () => {
  let service: ImagenesProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagenesProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
