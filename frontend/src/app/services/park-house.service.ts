import { Injectable, OnInit } from '@angular/core';
import { ParkHouse } from '../models/ParkHouse';
import { Sector } from '../models/Sector';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonData } from '../common-data';
import { Observable, Subject } from 'rxjs';
import { CommonService } from './common.service';
import { SectorService } from './sector.service';

@Injectable({
  providedIn: 'root'
})
export class ParkHouseService {

  loadedParkHouses: Subject<boolean> = new Subject<boolean>();
  deletedParkHouse: Subject<boolean> = new Subject<boolean>();
  addedParkHouse: Subject<boolean> = new Subject<boolean>();
  updatedParkHouse: Subject<ParkHouse> = new Subject<ParkHouse>();
  addedSectorToParkHouse: Subject<ParkHouse> = new Subject<ParkHouse>();
  removedSectorToParkHouse: Subject<boolean> = new Subject<boolean>();
  errorOccured: Subject<string> = new Subject<string>();

  parkHouses: ParkHouse[] = [
  ]

  constructor(private http: HttpClient, private commonService:CommonService, private sectorService:SectorService) {
  }

  loadParkHouses(): void {
    this.commonService.isLoading=true;
    this.http.get<ParkHouse[]>(CommonData.hostUri + 'parkHouses/all').subscribe(
      response => {
        this.commonService.isLoading=false;
        this.parkHouses = response
        for(let ph of this.parkHouses){
          for(let sector of ph.sectors){
            this.sectorService.adjustParkingLots(sector);
          }
        }
        this.loadedParkHouses.next(true);
      }, error=>this.handleError(error)
    );
  }
  removeParkHouse(parkHouse: ParkHouse) {
    this.commonService.isLoading=true;
    this.http.delete(CommonData.hostUri + 'parkHouses/delete/' + parkHouse.id).subscribe(response => {
      this.commonService.isLoading=false;
      console.log(response);
      let index = this.parkHouses.indexOf(parkHouse);
      this.parkHouses.splice(index, 1);
      this.deletedParkHouse.next(true);
    }, error=>this.handleError(error));

  }

  addNewParkHouse(newParkHouse: ParkHouse) {
    this.commonService.isLoading=true;
    this.http.post<ParkHouse>(CommonData.hostUri + 'parkHouses/newPH', newParkHouse).subscribe(response => {
      this.commonService.isLoading=false;
      this.parkHouses.push(response);
      this.addedParkHouse.next(true);
    }, error=> this.handleError(error));

  }



  updateParkHouse(parkHouse: ParkHouse): void {
    this.commonService.isLoading=true;
    let index = this.parkHouses.findIndex(ph => ph.id === parkHouse.id);
    this.http.put<ParkHouse>(CommonData.hostUri + 'parkHouses/updatePH/' + parkHouse.id, parkHouse).subscribe(response => {
      this.commonService.isLoading=false;
      this.parkHouses[index] = response;
      this.updatedParkHouse.next(response);
    }, error=>this.handleError(error));
  }

  getParkHouse(id: number): ParkHouse {
    return this.parkHouses.find(ph => ph.id === id);
  }

  //TODO LISTA!!
  addSectors(parkHouse: ParkHouse, newSector: Sector): void {

    let index = this.parkHouses.findIndex(ph => ph.id === parkHouse.id);
    this.commonService.isLoading=true;
    this.http.put<ParkHouse>(CommonData.hostUri + 'parkHouses/addSectors/' + parkHouse.id, [newSector]).subscribe(response => {
      this.commonService.isLoading=false;
      this.parkHouses[index] = response;
      this.addedSectorToParkHouse.next(response);
      //newSector.parkHouse = parkHouse;
      //parkHouse.sectors.push(newSector);
    }, error=>this.handleError(error));

  }

  removeSector(parkHouse: ParkHouse, sector: Sector) {
    this.commonService.isLoading=true;
    this.http.delete<number>(CommonData.hostUri+'sectors/delete/'+sector.id).subscribe(response=>{
      this.commonService.isLoading=false;
      let index = parkHouse.sectors.findIndex(elem=>elem.id==response);
      parkHouse.sectors.splice(index, 1);
      this.removedSectorToParkHouse.next(true);
    }, error=>this.handleError(error));
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
