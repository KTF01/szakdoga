import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CommonService } from './common.service';
import { CommonData } from '../common-data';
import { Car } from '../models/Car';
import { Subject } from 'rxjs';
import { Role } from '../models/Role';
import { faUser, faUserEdit, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { ParkingLotService } from './parking-lot.service';
import { Reservation } from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  users:User[];
  cars:Car[]=[];
  reservations:Reservation[];

  usersLoaded: Subject<boolean> = new Subject<boolean>();
  carAdded: Subject<Car> = new Subject<Car>();
  carRemoved: Subject<Car[]> = new Subject<Car[]>();
  roleSet: Subject<Role> = new Subject<Role>();
  errorOccured: Subject<string> = new Subject<string>();

  constructor( private http:HttpClient, private commonService:CommonService, private parkingLotService:ParkingLotService) { }

  getById(id:number){
    let index:number = this.users.findIndex(user=>user.id==id);
    return this.users[index];
  }


  loadUsers(){
    this.commonService.isLoading = true;
    this.http.get<{usersData:{user:User, userCars:Car[], userReservations:Reservation[]}[]}>(CommonData.hostUri+'auth/users/all',{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response=>{
      this.users=[];
      this.cars=[];
      this.reservations=[];
      for(let userData of response.usersData){
        userData.user.role= (<any>Role)[userData.user.role];
        let user:User = this.setUpUserCarsAndRes(userData);
        for(let car of user.ownedCars){
          this.cars.push(car);
        }
        for(let res of user.reservations){
          this.reservations.push(res);
        }
        this.users.push(user);
        this.usersLoaded.next();
      }
      this.commonService.isLoading=false;
    }, error=>this.handleError(error))
  }

  addCarToUser(user:User, newCar:Car){
    this.commonService.isLoading=true;
    this.http.post<Car>(CommonData.hostUri+'auth/cars/newCarToUser/'+user.id, newCar,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response=>{
      response.owner=user;
      user.ownedCars.push(response);
      this.carAdded.next(response);
      this.commonService.isLoading=false;
    }, error=>this.handleError(error));
  }

  deleteCar(car:Car){
    this.commonService.isLoading=true;
    this.http.delete<Car[]>(CommonData.hostUri+'auth/cars/delete/'+`${car.plateNumber}`,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response=>{
      let index:number =  car.owner.ownedCars.findIndex(c=>c.plateNumber==car.plateNumber);
      car.owner.ownedCars.splice(index, 1);
      this.commonService.isLoading=false;
      this.carRemoved.next(car.owner.ownedCars);
    },
    error=>this.handleError(error));
  }

  setRole(user:User, role:Role){
    this.commonService.isLoading=true;

    let endpointString: string="";
    switch (role){
      case Role.ROLE_ADMIN: endpointString = "grantAdmin/"; break;
      case Role.ROLE_USER: endpointString = "depriveAdmin/"; break;
      case Role.ROLE_FIRST_USER: endpointString = "passFirstUser/";break;
    }
    this.http.put<User>(CommonData.hostUri+'auth/users/'+endpointString+user.id, null,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response=>{
      response.role=(<any>Role)[response.role];
      user.role=response.role;
      this.commonService.isLoading=false;
      this.roleSet.next(response.role);
    }, error=>this.handleError(error));
  }

  getUserIcon(user:User){
    let userIcon;
    switch (user.role){
        case Role.ROLE_USER: userIcon =faUser; break;
        case Role.ROLE_ADMIN: userIcon=faUserEdit; break;
        case Role.ROLE_FIRST_USER: userIcon=faUserCog; break;
    }
      return userIcon;
  }

  setUpUserCarsAndRes(userData:{user:User, userCars:Car[], userReservations:Reservation[]}){
    userData.user.ownedCars=userData.userCars;
    for(let car of userData.userCars){
      car.owner=userData.user;
      if(car.occupiedParkingLot){
        car.occupiedParkingLot=this.parkingLotService.getParkingLot(car.occupiedParkingLot.id);
      }
    }
    userData.user.reservations=userData.userReservations;
    for(let res of userData.userReservations){
      res.user=userData.user;
      res.parkingLot=this.parkingLotService.getParkingLot(res.parkingLot.id);
    }
    return userData.user;
  }

  handleError(error:HttpErrorResponse){
    this.commonService.isLoading=false;
    console.log(error);
    switch(error.status){
      case 0: this.errorOccured.next(CommonData.unknownErrorText); break;
      case 400: this.errorOccured.next(error.error.message);break;
      case 401: this.errorOccured.next("HIBA: 401");break;
      case 500: this.errorOccured.next(error.error.error);break;
      default: this.errorOccured.next(error.message);
    }
  }

}
