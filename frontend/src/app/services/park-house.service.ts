import { Injectable, OnInit, ErrorHandler } from '@angular/core';
import { ParkHouse } from '../models/ParkHouse';
import { Sector } from '../models/Sector';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CommonData } from '../common-data';
import { Observable, Subject } from 'rxjs';
import { CommonService } from './common.service';
import { SectorService } from './sector.service';
import { AuthService } from './auth.service';
import { ParkingLot } from '../models/ParkingLot';
import { Car } from '../models/Car';

@Injectable({
  providedIn: 'root'
})
export class ParkHouseService extends ErrorHandler {

  loadedParkHouses: Subject<boolean> = new Subject<boolean>();
  deletedParkHouse: Subject<number> = new Subject<number>();
  addedParkHouse: Subject<ParkHouse> = new Subject<ParkHouse>();
  updatedParkHouse: Subject<ParkHouse> = new Subject<ParkHouse>();
  addedSectorToParkHouse: Subject<ParkHouse> = new Subject<ParkHouse>();
  removedSectorToParkHouse: Subject<boolean> = new Subject<boolean>();
  errorOccured: Subject<string> = new Subject<string>();

  parkHouses: ParkHouse[] = [
  ]

  constructor(private http: HttpClient, private commonService: CommonService, private sectorService: SectorService) {
    super();
  }

  loadParkHouses(): void {
    this.commonService.isLoading = true;
    this.http.get<{ parkHouses: ParkHouse[], cars: Car[] }>(CommonData.hostUri + 'auth/parkHouses/all', {
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(
      response => {
        this.parkHouses = response.parkHouses;
        for (let ph of this.parkHouses) {
          this.adjustSectors(ph);
          for (let sector of ph.sectors) {
            this.sectorService.adjustParkingLotsWithCars(sector, response.cars);
          }
        }
        this.commonService.isLoading = false;
        this.loadedParkHouses.next(true);
      }, error => this.handleError(error)
    );
  }

  adjustSectors(parkHouse: ParkHouse) {
    for (let sector of parkHouse.sectors) {
      sector.parkHouse = parkHouse;
    }
  }

  removeParkHouse(parkHouse: ParkHouse) {
    this.commonService.isLoading = true;
    this.http.delete<number>(CommonData.hostUri + 'auth/parkHouses/delete/' + parkHouse.id,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response => {
      this.commonService.isLoading = false;
      console.log(response);
      let index = this.parkHouses.indexOf(parkHouse);
      this.parkHouses.splice(index, 1);
      this.deletedParkHouse.next(response);
    }, error => this.handleError(error));

  }

  addNewParkHouse(newParkHouse: ParkHouse) {
    this.commonService.isLoading = true;
    this.http.post<ParkHouse>(CommonData.hostUri + 'auth/parkHouses/newPH', newParkHouse,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response => {
      this.commonService.isLoading = false;
      this.parkHouses.push(response);
      this.addedParkHouse.next(response);
    }, error => this.handleError(error));

  }



  updateParkHouse(parkHouse: ParkHouse): void {
    this.commonService.isLoading = true;
    let index = this.parkHouses.findIndex(ph => ph.id === parkHouse.id);
    console.log(parkHouse);
    this.http.put<ParkHouse>(CommonData.hostUri + 'auth/parkHouses/updatePH/' + parkHouse.id, {
      name: parkHouse.name,
      address: parkHouse.address,
      numberOfFloors: parkHouse.numberOfFloors
    },{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response => {
      this.commonService.isLoading = false;
      this.parkHouses[index].name = response.name;
      this.parkHouses[index].address = response.address;
      this.parkHouses[index].numberOfFloors = response.numberOfFloors;
      this.updatedParkHouse.next(response);
    }, error => this.handleError(error));
  }

  getParkHouse(id: number): ParkHouse {
    return this.parkHouses.find(ph => ph.id === id);
  }

  addSectors(parkHouse: ParkHouse, newSector: Sector): void {

    let index = this.parkHouses.findIndex(ph => ph.id === parkHouse.id);
    this.commonService.isLoading = true;
    this.http.put<ParkHouse>(CommonData.hostUri + 'auth/parkHouses/addSectors/' + parkHouse.id, [newSector],{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response => {
      this.commonService.isLoading = false;
      this.parkHouses[index] = response;
      this.addedSectorToParkHouse.next(response);
    }, error => this.handleError(error));

  }

  removeSector(parkHouse: ParkHouse, sector: Sector) {
    this.commonService.isLoading = true;
    this.http.delete<number>(CommonData.hostUri + 'auth/sectors/delete/' + sector.id,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response => {
      this.commonService.isLoading = false;
      let index = parkHouse.sectors.findIndex(elem => elem.id == response);
      parkHouse.sectors.splice(index, 1);
      this.removedSectorToParkHouse.next(true);
    }, error => this.handleError(error));
  }


  getParkingLot(id: number): ParkingLot {
    for (let parkHouse of this.parkHouses) {
      for (let sector of parkHouse.sectors) {
        let pl: ParkingLot = sector.parkingLots.find(pl => pl.id === id);
        if (pl) {
          return pl;
        }
      }
    }
  }



  handleError(error: HttpErrorResponse) {
    this.commonService.isLoading = false;
    console.log(error);
    switch (error.status) {
      case 400: this.errorOccured.next(error.error.error); break;
      case 401: this.errorOccured.next(error.error); break;
      case 500: this.errorOccured.next(error.error.error); break;
      default: this.errorOccured.next(error.message);
    }
  }

}
