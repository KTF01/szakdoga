import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { Car } from '../../models/Car';
import { CommonService } from '../../services/common.service';
import { PopUpContainer } from '../pop-up/PopUpContainer';
import { ParkingLotService } from '../../services/parking-lot.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent extends PopUpContainer implements OnInit, OnDestroy{

  faCar = faCar;

  selectedCar:Car = null;

  parkOutSub:Subscription = null;
  errorSub:Subscription = null;

  constructor(public authService:AuthService, public commonService:CommonService, private parkingLotService:ParkingLotService) {super(); }

  ngOnInit(): void {
    console.log('REFRESH');
    this.authService.refreshLoggedInUserData();
  }

  parkOut(){
    console.log("KIÁLL!");
    this.parkingLotService.parkOut(this.selectedCar.occupiedParkingLot);
    this.parkOutSub = this.parkingLotService.parkedOut.subscribe(responseParkingLot=>{
      this.selectedCar.occupiedParkingLot=null;
      this.closePopUp();
    });
    this.errorSub = this.parkingLotService.errorOccured.subscribe(error=>{
      console.log(error)
    })
  }

  ngOnDestroy(){
    if(this.parkOutSub) this.parkOutSub.unsubscribe();
    if(this.errorSub) this.errorSub.unsubscribe();
  }
}
