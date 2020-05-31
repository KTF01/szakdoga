import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { faCar, faSearch} from '@fortawesome/free-solid-svg-icons';
import { UserServiceService } from '../../services/user-service.service';
import { Car } from '../../models/Car';
import { ParkingLotService } from '../../services/parking-lot.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

  carIcon=faCar;
  searchIcon=faSearch;

  parkedOutSub:Subscription = new Subscription();
  errorSub:Subscription = new Subscription();

  errorText:string = "";
  plateFilter:string="";

  constructor(public userService:UserServiceService, public commonService:CommonService, private parkingLotService:ParkingLotService) { }

  ngOnInit(): void {
  }
  //A kereső mező szerinti szűrése az autóknak.
  filterEdCarList():Car[]{
    if(this.plateFilter===""){
      return this.userService.cars;
    }else{
      return this.userService.cars.filter(elem=>{
        return elem.plateNumber.toUpperCase().includes(this.plateFilter.toUpperCase());
      });
    }

  }

  //Meghívjuk a kiszolgáló parkOut metódusát, hogy végezze el a kiállás műveletét.
  parkOut(car:Car){
    this.parkingLotService.parkOut(car.occupiedParkingLot);
    this.parkedOutSub = this.parkingLotService.parkedOut.subscribe(_=>{
      car.occupiedParkingLot=null;
    });
    this.errorSub = this.parkingLotService.errorOccured.subscribe(error=>{
      this.errorText=error;
    });
  }

}
