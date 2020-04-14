import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkHouseDetailComponent } from './park-house-detail.component';

describe('ParkHouseDetailComponent', () => {
  let component: ParkHouseDetailComponent;
  let fixture: ComponentFixture<ParkHouseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkHouseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkHouseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
