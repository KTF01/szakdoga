import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  isLoading:boolean=false;
  authToken:string=null;
  loggedInId:number = null;
  authLongitude:number;
  authLatitude:number;
  isLocationAvailable:boolean = true;
  constructor() { }
}
