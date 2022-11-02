import { TestBed } from '@angular/core/testing';

import { DetallesProformasService } from './detalles-proformas.service';

describe('DetallesProformasService', () => {
  let service: DetallesProformasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallesProformasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
