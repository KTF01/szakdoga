import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingLotListComponent } from './parking-lot-list.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ParkingLotListComponent', () => {
  let component: ParkingLotListComponent;
  let fixture: ComponentFixture<ParkingLotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingLotListComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingLotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
