import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { faCar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Car } from '../../models/Car';
import { CommonService } from '../../services/common.service';
import { PopUpContainer } from '../pop-up/PopUpContainer';
import { ParkingLotService } from '../../services/parking-lot.service';
import { Subscription } from 'rxjs';
import { UserServiceService } from '../../services/user-service.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent extends PopUpContainer implements OnInit, OnDestroy{

  faCar = faCar;
  deleteIson = faTrash;

  selectedCar:Car = null;

  parkOutSub:Subscription = null;
  carAddSub:Subscription=null;
  carRemoveSub:Subscription=null;
  errorSub:Subscription = null;

  constructor(public authService:AuthService, public commonService:CommonService, private parkingLotService:ParkingLotService,
    private userService:UserServiceService) {super(); }

  ngOnInit(): void {
    this.authService.refreshLoggedInUserData();
  }

  parkOut(){
    this.parkingLotService.parkOut(this.selectedCar.occupiedParkingLot);
    this.parkOutSub = this.parkingLotService.parkedOut.subscribe(responseParkingLot=>{
      this.selectedCar.occupiedParkingLot=null;
      this.closePopUp();
    });
    this.errorSub = this.parkingLotService.errorOccured.subscribe(error=>{
      console.log(error)
    })
  }



  addNewCar(plateNumbInput){
    if(plateNumbInput.valid){
      let newCar:Car= {plateNumber: plateNumbInput.value}
      this.userService.addCarToUser(this.authService.loggedInUser,newCar);
      this.carAddSub = this.userService.carAdded.subscribe(_=>{
        this.closePopUp2();
      });
    }
  }

  removeCar(car:Car){
    this.userService.deleteCar(car);
    this.carRemoveSub = this.userService.carRemoved.subscribe(newCarList=>{
      console.log(newCarList);
      this.authService.loggedInUser.ownedCars=newCarList;
      this.selectedCar=null;
      this.closePopUp3();
    });
  }

  ngOnDestroy(){
    if(this.parkOutSub) this.parkOutSub.unsubscribe();
    if(this.errorSub) this.errorSub.unsubscribe();
    if(this.carAddSub) this.carAddSub.unsubscribe();
    if(this.carRemoveSub) this.carRemoveSub.unsubscribe();
  }

  openPopUp2(){
    this.popUp2IsOpen=true;
    this.selectedCar=null;
  }
}
