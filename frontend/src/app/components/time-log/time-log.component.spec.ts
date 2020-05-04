import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLogComponent } from './time-log.component';
import { HttpClientModule } from '@angular/common/http';

describe('TimeLogComponent', () => {
  let component: TimeLogComponent;
  let fixture: ComponentFixture<TimeLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLogComponent ],
      imports: [HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
