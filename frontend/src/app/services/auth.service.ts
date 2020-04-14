import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CommonData } from '../common-data';
import { User } from '../models/User';
import { Subject } from 'rxjs';
import { CommonService } from './common.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  errorOccured: Subject<string> = new Subject<string>();
  signUpSubject: Subject<User> = new Subject<User>();
  loggedIn: Subject<User> = new Subject<User>();

  loggedInUser: User = null;
  authToken:string=null;

  constructor(private http:HttpClient, private commonService:CommonService, private router: Router) { }

  login(email:string, password:string){
    const token:string = btoa(`${email}:${password}`);

    this.http.post<User>(CommonData.hostUri+'auth/users/login', email,{
      headers: new HttpHeaders({'Authorization': `Basic ${token}`})
    }).subscribe(response=>{
      this.loggedInUser=response;
      this.authToken=token;
      this.loggedIn.next(response);
    }, error=>this.handleError(error));
  }

  logout(){
    this.loggedInUser=null;
    this.authToken=null;
    this.router.navigate(['login']);
  }

  signup(newUser:User){
    this.commonService.isLoading=true;
    this.http.post<User>(CommonData.hostUri+'users/signUp',newUser).subscribe(response=>{
      console.log(response);
      this.signUpSubject.next(response);
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
