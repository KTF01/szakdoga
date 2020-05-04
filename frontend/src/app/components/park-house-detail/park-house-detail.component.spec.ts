import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkHouseDetailComponent } from './park-house-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ParkHouseDetailComponent', () => {
  let component: ParkHouseDetailComponent;
  let fixture: ComponentFixture<ParkHouseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkHouseDetailComponent ],
      imports : [RouterTestingModule, HttpClientModule]
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
