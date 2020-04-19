import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CommonService } from './common.service';
import { CommonData } from '../common-data';
import { AuthService } from './auth.service';
import { Car } from '../models/Car';
import { Subject } from 'rxjs';
import { Role } from '../models/Role';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  users:User[];

  carAdded: Subject<Car> = new Subject<Car>();
  carRemoved: Subject<Car[]> = new Subject<Car[]>();
  errorOccured: Subject<string> = new Subject<string>();

  constructor(private http:HttpClient, private authService:AuthService, private commonService:CommonService) { }

  loadUsers(){
    this.http.get<{usersData:{user:User, userCars:Car[]}[]}>(CommonData.hostUri+'auth/users/all',{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response=>{
      this.users=[];
      for(let userData of response.usersData){
        userData.user.role= (<any>Role)[userData.user.role];
        let user:User = this.authService.setUpUserCars(userData);
        this.users.push(user);
      }
    })
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
      car.owner.ownedCars = response;
      this.commonService.isLoading=false;
      this.carRemoved.next(car.owner.ownedCars);
    }, error=>this.handleError(error));
  }

  handleError(error:HttpErrorResponse){
    this.commonService.isLoading=false;
    console.log(error);
    switch(error.status){
      case 400: this.errorOccured.next(error.error.message);break;
      case 401: this.errorOccured.next("HIBA: 401");break;
      case 500: this.errorOccured.next(error.error.error);break;
      default: this.errorOccured.next(error.message);
    }
  }

}
