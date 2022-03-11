import { TestBed } from '@angular/core/testing';

import { TiposPersonaService } from './tipos-persona.service';

describe('TiposPersonaService', () => {
  let service: TiposPersonaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposPersonaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
