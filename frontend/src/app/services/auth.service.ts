import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CommonData } from '../common-data';
import { User } from '../models/User';
import { Subject } from 'rxjs';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
import { ParkingLotService } from './parking-lot.service';
import { ParkHouseService } from './park-house.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  errorOccured: Subject<string> = new Subject<string>();
  signUpSubject: Subject<User> = new Subject<User>();
  loggedIn: Subject<User> = new Subject<User>();

  loggedInUser: User = null;
  authToken:string=null;
  isLogedIn:boolean=false;

  constructor(private http:HttpClient, private commonService:CommonService, private router: Router, private parkingLotService:ParkingLotService) { }

  login(email:string, password:string){
    const token:string = btoa(`${email}:${password}`);

    this.http.post<User>(CommonData.hostUri+'auth/users/login', email,{
      headers: new HttpHeaders({'Authorization': `Basic ${token}`})
    }).subscribe(response=>{

      for(let car of response.ownedCars){
        car.owner=response;
      }

      this.loggedInUser=response;
      this.authToken=token;
      this.isLogedIn=true;
      this.loggedIn.next(response);
    }, error=>this.handleError(error));
  }

  logout(){
    this.loggedInUser=null;
    this.authToken=null;
    this.isLogedIn=false;
    this.router.navigate(['login']);
  }

  signup(newUser:User){
    this.commonService.isLoading=true;
    this.http.post<User>(CommonData.hostUri+'users/signUp',newUser).subscribe(response=>{
      this.signUpSubject.next(response);
      this.commonService.isLoading=false;
    }, error=>this.handleError(error));
  }

  refreshLoggedInUserData(){
    this.commonService.isLoading=true;
    this.http.get<User>(CommonData.hostUri+'auth/users/'+this.loggedInUser.id, {
      headers: new HttpHeaders({'Authorization': `Basic ${this.authToken}`})
    }).subscribe(response=>{
      for(let car of response.ownedCars){
        car.owner=response;
        if(car.occupiedParkingLot){
          car.occupiedParkingLot=this.parkingLotService.getParkingLot(car.occupiedParkingLot);
        }
      }
      this.loggedInUser=response;
      this.commonService.isLoading=false;
    }, error=>this.handleError(error));
  }


  handleError(error:HttpErrorResponse){
    this.commonService.isLoading=false;
    console.log(error);
    switch(error.status){
      case 400: this.errorOccured.next(error.error.message);break;
      case 401: this.errorOccured.next("Helytelen email vagy jelszó!");break;
      case 500: this.errorOccured.next(error.error.error);break;
      default: this.errorOccured.next(error.message);
    }
  }
}
