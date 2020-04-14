import { Injectable } from '@angular/core';
import { ParkHouseService } from './park-house.service';
import { ParkingLot } from '../models/ParkingLot';
import { Sector } from '../models/Sector';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonData } from '../common-data';
import { CommonService } from './common.service';
import { Subject } from 'rxjs';
import { SectorService } from './sector.service';

@Injectable({
  providedIn: 'root'
})
export class ParkingLotService {

  parkingLotsAdded:Subject<boolean> = new Subject<boolean>();
  parkingLotsDeleted:Subject<boolean> = new Subject<boolean>();
  parkingLotUpdated:Subject<string> = new Subject<string>();
  errorOccured: Subject<string> = new Subject<string>();

  constructor( private sectorService:SectorService, private parkHouseService: ParkHouseService, private http:HttpClient, private commonService:CommonService) {

  }

  addParkingLots(sector:Sector,newPls: ParkingLot[]):void{
    this.commonService.isLoading=true;
    console.log(newPls);
    this.http.put<Sector>(CommonData.hostUri+'sectors/addParkingLot/'+sector.id, newPls).subscribe(response=>{
      console.log(response);
      this.commonService.isLoading=false;
      this.sectorService.adjustParkingLots(response);
      sector.parkingLots=response.parkingLots;
      this.parkingLotsAdded.next(true);
    }, error=>this.handleError(error));
  }

  getParkingLot(id:number): ParkingLot{
    for(let parkHouse of this.parkHouseService.parkHouses ) {
      console.log(parkHouse);
      for(let sector of parkHouse.sectors){

        let pl:ParkingLot = sector.parkingLots.find(pl=>pl.id===id);
        if(pl){
          return pl;
        }
      }
    }
  }

  removeParkingLot(parkinglot:ParkingLot): void{
    this.commonService.isLoading=true;
    this.http.delete<number>(CommonData.hostUri+'parkingLots/delete/'+parkinglot.id).subscribe(response=>{
      console.log(response);
      this.commonService.isLoading=false;
      let index = parkinglot.sector.parkingLots.findIndex(elem=>elem.id==response);
      parkinglot.sector.parkingLots.splice(index,1);
      this.parkingLotsDeleted.next(true);
    },error=>this.handleError(error));
  }

updateParkingLotName(parkinglot:ParkingLot, newName:string){
  this.commonService.isLoading=true;
  this.http.put<ParkingLot>(CommonData.hostUri+'parkingLots/update/'+parkinglot.id, newName).subscribe(response=>{
    this.commonService.isLoading=false;
    console.log(response);
    let index = parkinglot.sector.parkingLots.findIndex(elem=>elem.id==response.id);
    response.sector=parkinglot.sector;
    parkinglot.sector.parkingLots[index]=response;
    this.parkingLotUpdated.next(response.name);
  }, error=>{this.handleError(error)})
}

  handleError(error:HttpErrorResponse){
    this.commonService.isLoading=false;
    switch(error.status){
      case 400: this.errorOccured.next(error.error.error);break;
      case 500: this.errorOccured.next(error.error.error);break;
      default: this.errorOccured.next(error.message);
    }
  }
}
