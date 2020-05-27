import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CommonData } from '../common-data';
import { CommonService } from './common.service';
import { Subject } from 'rxjs';
import { Reservation } from '../models/Reservation';
import { ParkingLot } from '../models/ParkingLot';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationServiceService {

  makeReservSub:Subject<Reservation> = new Subject<Reservation>();
  deleteReservSub:Subject<ParkingLot> = new Subject<ParkingLot>();
  errorOccured: Subject<string> = new Subject<string>();

  constructor(private http:HttpClient, private commonService:CommonService, private authService:AuthService) { }

  makeResevation(parkingLot:ParkingLot, userId:number, duration:number){
    this.commonService.isLoading=true;
    let params:HttpParams = new HttpParams();
    params=params.append("plId", parkingLot.id.toString());
    params=params.append("userId", userId.toString());
    params=params.append("duration", duration.toString());
    this.http.post<Reservation>(CommonData.hostUri+'auth/reservations/reserve', null,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`}),
      params: params
    }).subscribe(response=>{
      this.authService.loggedInUser.reservations.push(response);
      this.makeReservSub.next(response);
      this.commonService.isLoading=false;
    },error=>{console.log(error);
      this.handleError(error)});
  }

  deleteReservation(reservationId:number){
    this.commonService.isLoading=true;
    this.http.delete<ParkingLot>(CommonData.hostUri+'auth/reservations/delete/'+reservationId,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`}),
    }).subscribe(response=>{
      console.log(response);
      let index = this.authService.loggedInUser.reservations.findIndex((res=>res.id==response.id));
      this.authService.loggedInUser.reservations.splice(index,1);
      this.deleteReservSub.next(response);
      this.commonService.isLoading=false;
    },error=>{console.log(error);
      this.handleError(error)});
  }

  handleError(error: HttpErrorResponse) {
    this.commonService.isLoading = false;
    console.log(error);
    switch (error.status) {
      case 0: this.errorOccured.next(CommonData.unknownErrorText); break;
      case 400: this.errorOccured.next(error.error.error); break;
      case 500: this.errorOccured.next(error.error.error); break;
      default: this.errorOccured.next(error.message);
    }
  }
}
