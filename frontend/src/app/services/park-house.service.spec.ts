import { TestBed } from '@angular/core/testing';

import { ParkHouseService } from './park-house.service';

describe('ParkHouseService', () => {
  let service: ParkHouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkHouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
