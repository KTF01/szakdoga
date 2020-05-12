import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonData } from '../common-data';
import { CommonService } from './common.service';
import { Subject } from 'rxjs';
import { Reservation } from '../models/Reservation';
import { ParkingLot } from '../models/ParkingLot';

@Injectable({
  providedIn: 'root'
})
export class ReservationServiceService {

  makeReservSub:Subject<Reservation> = new Subject<Reservation>();
  deleteReservSub:Subject<ParkingLot> = new Subject<ParkingLot>();

  constructor(private http:HttpClient, private commonService:CommonService) { }

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
      console.log(response);
      this.makeReservSub.next(response);
      this.commonService.isLoading=false;
    },error=>{console.log(error);
      this.commonService.isLoading=false;});
  }

  deleteReservation(reservationId:number){
    this.commonService.isLoading=true;
    this.http.delete<ParkingLot>(CommonData.hostUri+'auth/reservations/delete/'+reservationId,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`}),
    }).subscribe(response=>{
      console.log(response);
      this.deleteReservSub.next(response);
      this.commonService.isLoading=false;
    },error=>{console.log(error);
      this.commonService.isLoading=false;});
  }
}
