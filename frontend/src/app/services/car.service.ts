import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Car } from '../models/Car';
import { CommonData } from '../common-data';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  cars:Car[];

  constructor(private http:HttpClient, private commonService:CommonService) { }

  loadAllCars(){
    this.commonService.isLoading=true;
    this.http.get<Car[]>(CommonData.hostUri+'auth/cars/all',{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response=>{
      this.cars=response;
      console.log(response);
      this.commonService.isLoading=false;
    },error=>{
      this.commonService.isLoading=false;
      console.log(error);
    });
  }

}
