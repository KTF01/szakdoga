import { Injectable } from '@angular/core';
import { ParkHouseService } from './park-house.service';
import { ParkingLot } from '../models/ParkingLot';
import { Sector } from '../models/Sector';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CommonData } from '../common-data';
import { CommonService } from './common.service';
import { Subject } from 'rxjs';
import { SectorService } from './sector.service';
import { Car } from '../models/Car';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ParkingLotService {

  parkingLotsAdded: Subject<boolean> = new Subject<boolean>();
  parkingLotsDeleted: Subject<boolean> = new Subject<boolean>();
  parkingLotUpdated: Subject<string> = new Subject<string>();
  parkedOut: Subject<ParkingLot> = new Subject<ParkingLot>();
  parkedIn: Subject<ParkingLot> = new Subject<ParkingLot>();
  errorOccured: Subject<string> = new Subject<string>();

  constructor(private sectorService: SectorService, private parkHouseService: ParkHouseService, private http: HttpClient, private commonService: CommonService) {

  }

  addParkingLots(sector: Sector, newPls: ParkingLot[]): void {
    this.commonService.isLoading = true;
    this.http.put<Sector>(CommonData.hostUri + 'auth/sectors/addParkingLot/' + sector.id, newPls,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response => {
      console.log(response);
      this.commonService.isLoading = false;
      this.sectorService.adjustParkingLots(response);
      sector.parkingLots = response.parkingLots;
      sector.freePlCount=response.freePlCount
      this.parkingLotsAdded.next(true);
    }, error => this.handleError(error));
  }

  getParkingLot(id:number): ParkingLot {
    for (let parkHouse of this.parkHouseService.parkHouses) {
      for (let sector of parkHouse.sectors) {

        let pl: ParkingLot = sector.parkingLots.find(pl => pl.id === id);
        if (pl) {
          return pl;
        }
      }
    }
  }

  removeParkingLot(parkinglot: ParkingLot): void {
    this.commonService.isLoading = true;
    this.http.delete<number>(CommonData.hostUri + 'auth/parkingLots/delete/' + parkinglot.id,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response => {
      this.commonService.isLoading = false;
      let index = parkinglot.sector.parkingLots.findIndex(elem => elem.id == response);
      parkinglot.sector.parkingLots.splice(index, 1);
      parkinglot.sector.freePlCount--;
      this.parkingLotsDeleted.next(true);
      console.log(response);
    }, error => this.handleError(error));
  }

  updateParkingLotName(parkinglot: ParkingLot, newName: string) {
    this.commonService.isLoading = true;
    this.http.put<ParkingLot>(CommonData.hostUri + 'auth/parkingLots/update/' + parkinglot.id, newName,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response => {
      this.commonService.isLoading = false;
      console.log(response);
      let index = parkinglot.sector.parkingLots.findIndex(elem => elem.id == response.id);
      response.sector = parkinglot.sector;
      parkinglot.sector.parkingLots[index] = response;
      this.parkingLotUpdated.next(response.name);
    }, error => { this.handleError(error) })
  }

  parkOut(parkingLot: ParkingLot) {
    if (parkingLot.occupiingCar) {
      this.commonService.isLoading = true;
      this.http.put<ParkingLot>(CommonData.hostUri + 'auth/parkingLots/parkOut/' + parkingLot.id, null,{
        headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
      }).subscribe(response => {
        let index = parkingLot.sector.parkingLots.findIndex(elem => elem.id == response.id);
        parkingLot.sector.freePlCount--;
        response.sector = parkingLot.sector;
        parkingLot.sector.parkingLots[index] = response;
        this.commonService.isLoading = false;
        this.parkedOut.next(response);
      }, error => this.handleError(error));
    }
  }

  parkIn(parkingLot:ParkingLot, car:Car){
    this.commonService.isLoading=true;
    this.http.put<{parkingLot:ParkingLot, car:Car}>(CommonData.hostUri+'auth/parkingLots/parkIn/'+parkingLot.id+'/'+car.plateNumber, null,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response=>{
      response.parkingLot.occupiingCar=response.car;
      response.car.occupiedParkingLot=response.parkingLot;
      let index = parkingLot.sector.parkingLots.findIndex(elem => elem.id == response.parkingLot.id);
      response.parkingLot.sector = parkingLot.sector;
      response.parkingLot.sector.freePlCount++;
      parkingLot.sector.parkingLots[index] = response.parkingLot;

      this.commonService.isLoading=false;
      this.parkedIn.next(response.parkingLot);
    }, error=>this.handleError(error));
  }

  handleError(error: HttpErrorResponse) {
    this.commonService.isLoading = false;
    console.log(error);
    switch (error.status) {
      case 400: this.errorOccured.next(error.error.error); break;
      case 500: this.errorOccured.next(error.error.error); break;
      default: this.errorOccured.next(error.message);
    }
  }
}
