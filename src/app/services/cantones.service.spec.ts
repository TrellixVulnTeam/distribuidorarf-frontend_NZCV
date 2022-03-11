import { TestBed } from '@angular/core/testing';

import { CantonesService } from './cantones.service';

describe('CantonesService', () => {
  let service: CantonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CantonesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
