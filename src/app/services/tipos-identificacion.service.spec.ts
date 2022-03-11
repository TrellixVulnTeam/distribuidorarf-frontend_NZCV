import { TestBed } from '@angular/core/testing';

import { TiposIdentificacionService } from './tipos-identificacion.service';

describe('TiposIdentificacionService', () => {
  let service: TiposIdentificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposIdentificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
