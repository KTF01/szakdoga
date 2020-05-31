import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonData } from '../common-data';
import { User } from '../models/User';
import { Subject } from 'rxjs';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
import { Car } from '../models/Car';
import { Role } from '../models/Role';
import { UserServiceService } from './user-service.service';
import { Reservation } from '../models/Reservation';

/**
 * A bejelentkezést és a bejelentkezett felhasználót kezelő service.
 */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Az egyes aszi nkron műveletek végét subject-ekkel emittáljuk a komponensek felé akik fel tudnak ezekre iratkozni.
  errorOccured: Subject<string> = new Subject<string>();
  signUpSubject: Subject<User> = new Subject<User>();
  loggedIn: Subject<User> = new Subject<User>();
  refreshedLoggedInUser: Subject<User> = new Subject<User>();
  changedPassword: Subject<boolean> = new Subject<boolean>();
  closestParkHouse: Subject<number> = new Subject<number>();

  loggedInUser: User = null;

  isLogedIn: boolean = false;

  constructor(private http: HttpClient, private commonService: CommonService, private router: Router, private userService: UserServiceService) { }

  //Bejelentkezés post hívással
  login(email: string, password: string) {
    this.commonService.isLoading = true;
    const token: string = btoa(`${email}:${password}`);
    this.http.post<{ user: User, userCars: Car[], userReservations: Reservation[] }>(CommonData.hostUri + 'auth/users/login', email, {
      headers: new HttpHeaders({ 'Authorization': `Basic ${token}` })
    }).subscribe(response => {
      //Összekapcsoljuk a válaszban külön jövő autókat és foglalásokat a felhasználóval.
      response.user = this.userService.setUpUserCarsAndRes(response);
      response.user.role = (<any>Role)[response.user.role];
      this.loggedInUser = response.user;
      this.commonService.authToken = token;
      this.commonService.loggedInId = response.user.id;
      this.isLogedIn = true;

      //Eszköz helyadatainak lekérdezése
      navigator.geolocation.getCurrentPosition(pos => {
        this.commonService.authLongitude = pos.coords.longitude;
        this.commonService.authLatitude = pos.coords.latitude;
        this.commonService.isLocationAvailable=true;
        this.loggedIn.next(response.user);
        this.commonService.isLoading = false;
      }, (error) => {
          //Felhasználó megtagadta a helyadatok közlését.
          console.log(`Code: ${error.code} message: ${error.message}`);
          this.commonService.isLocationAvailable = false;
          //A feliratkozott osztályoknak jelzünk, hogy megtörtént a művelet.
          this.loggedIn.next(response.user);
          this.commonService.isLoading = false;
      });
    }, error => this.handleError(error));


  }

  //Kijelentkezés után átnavigálunk a bejelentkező felületre.
  logout() {
    this.loggedInUser = null;
    this.commonService.authToken = null;
    this.isLogedIn = false;
    this.router.navigate(['login']);
  }

  //Regisztráció post kéréssel
  signup(newUser: User) {
    this.commonService.isLoading = true;
    this.http.post<User>(CommonData.hostUri + 'users/signUp', newUser).subscribe(response => {
      this.signUpSubject.next(response);
      this.commonService.isLoading = false;
    }, error => this.handleError(error));
  }

  //A bejelentkezett felhasználó adataira bejelentkezés után is szükség van. Get kívással lekérdezzük
  refreshLoggedInUserData() {
    this.commonService.isLoading = true;
    this.http.get<{ user: User, userCars: Car[], userReservations: Reservation[] }>(CommonData.hostUri + 'auth/users/' + this.loggedInUser.id, {
      headers: new HttpHeaders({ 'Authorization': `Basic ${this.commonService.authToken}` })
    }).subscribe(response => {
      response.user = this.userService.setUpUserCarsAndRes(response);
      response.user.role = (<any>Role)[response.user.role];
      this.loggedInUser = response.user;
      this.refreshedLoggedInUser.next(response.user);
      this.commonService.isLoading = false;
    }, error =>{
      if (error.status == 0) {
        //Ha 0 státusszal keletkezi hiba (Nem lehetett elérni a szervert) akkor a login felületre navigálunk.
        this.router.navigate(["/login"]);
        this.commonService.isLoading=false;
      } else {
        this.handleError(error);
      }
    } );
  }

  //Jelszó változtatása put kéréssel.
  changePassword(oldPassword: string, newPassword: string) {
    this.commonService.isLoading = true;
    //elkódoljuk az emailt és a jelszót.
    const token: string = btoa(`${this.loggedInUser.email}:${oldPassword}`);
    const headers = new HttpHeaders({ 'Authorization': `Basic ${token}`, 'Content-Type': 'text/plain; charset=utf-8' });
    this.http.put<any>(CommonData.hostUri + 'auth/users/changePassword/' + this.loggedInUser.id, newPassword, {
      headers,
      responseType: 'text' as 'json'
    }).subscribe(response => {
      this.changedPassword.next(true);
      this.commonService.isLoading = false;
    }, error => {
      this.commonService.isLoading = false;
      console.log(error);
      if(error.status==401){
        this.errorOccured.next("Helytelen régi jelszó!");
      }else{
        this.handleError(error);
      }

    });
  }

  //Legközelebbi parkolóház lekérdezése.
  getClosestParkhouse() {
    this.commonService.isLoading = true;
    if (this.commonService.authLatitude && this.commonService.authLatitude) {
      let myParams: HttpParams = new HttpParams();
      myParams = myParams.append("userLong", this.commonService.authLongitude.toString());
      myParams = myParams.append("userLat", this.commonService.authLatitude.toString());
      this.http.get<number>(CommonData.hostUri + 'auth/getClosestPh', {
        //Fejlécben szerepel a token
        headers: new HttpHeaders({ 'Authorization': `Basic ${this.commonService.authToken}` }),
        params: myParams
      }).subscribe(response => {//A válasz a legközelebbi parkolóház id-ja
        this.closestParkHouse.next(response);
        this.commonService.isLoading = false;
      }, error=>this.handleError(error));
    } else {
      this.commonService.isLoading = false;
    }

  }

  //Hibák kezelése
  handleError(error: HttpErrorResponse) {
    this.commonService.isLoading = false;
    console.log(error);
    switch (error.status) {
      case 0: this.errorOccured.next(CommonData.unknownErrorText); break;
      case 400: this.errorOccured.next(error.error.message); break;
      case 401: this.errorOccured.next("Helytelen e-mail cím vagy jelszó!"); break;
      case 409: this.errorOccured.next("Ez az emailcím már regisztrálva van!"); break;
      case 500: this.errorOccured.next(error.error.error); break;
      default: this.errorOccured.next(error.message);
    }
  }
}
