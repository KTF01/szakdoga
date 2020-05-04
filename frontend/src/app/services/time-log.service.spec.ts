import { TestBed } from '@angular/core/testing';

import { TimeLogService } from './time-log.service';
import { HttpClientModule } from '@angular/common/http';

describe('TimeLogService', () => {
  let service: TimeLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientModule],});
    service = TestBed.inject(TimeLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
