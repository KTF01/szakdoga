import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from './common.service';
import { CommonData } from '../common-data';
import { AuthService } from './auth.service';
import { ParkHouseService } from './park-house.service';
import { Car } from '../models/Car';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  users:User[];

  constructor(private http:HttpClient, private commonService:CommonService, private authService:AuthService, private parkHouseService:ParkHouseService) { }

  loadUsers(){
    this.http.get<User[]>(CommonData.hostUri+'auth/users/all',{
      headers: new HttpHeaders({'Authorization': `Basic ${this.authService.authToken}`})
    }).subscribe(response=>{
      for(let user of response){
        for(let car of user.ownedCars){
          car.owner=user;
          for(let parkHouse of this.parkHouseService.parkHouses){
            for(let sector of parkHouse.sectors){
              for(let pl of sector.parkingLots){
                if (pl.id==car.occupiedParkingLot){
                  pl.occupiingCar= car;
                  car.occupiedParkingLot=pl;
                }
              }
            }
          }
        }
      }
      this.users=response;
      console.log(this.users);
    })
  }
}
