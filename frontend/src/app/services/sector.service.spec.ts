import { TestBed } from '@angular/core/testing';

import { SectorService } from './sector.service';
import { HttpClientModule } from '@angular/common/http';

describe('SectorService', () => {
  let service: SectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientModule],});
    service = TestBed.inject(SectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
