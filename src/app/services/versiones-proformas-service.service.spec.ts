import { TestBed } from '@angular/core/testing';

import { VersionesProformasServiceService } from './versiones-proformas-service.service';

describe('VersionesProformasServiceService', () => {
  let service: VersionesProformasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionesProformasServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
