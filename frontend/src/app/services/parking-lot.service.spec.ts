import { TestBed } from '@angular/core/testing';

import { ParkingLotService } from './parking-lot.service';
import { HttpClientModule } from '@angular/common/http';

describe('ParkingLotService', () => {
  let service: ParkingLotService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientModule],});
    service = TestBed.inject(ParkingLotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
