import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkHousesComponent } from './park-houses.component';

describe('ParkHousesComponent', () => {
  let component: ParkHousesComponent;
  let fixture: ComponentFixture<ParkHousesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkHousesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkHousesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
