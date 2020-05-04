import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingLotDetailComponent } from './parking-lot-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('ParkingLotDetailComponent', () => {
  let component: ParkingLotDetailComponent;
  let fixture: ComponentFixture<ParkingLotDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingLotDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingLotDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
