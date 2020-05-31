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
import { Reservation } from '../models/Reservation';
import { ParkHouse } from '../models/ParkHouse';

/**
 * Parkolókkal kapcsolatos kisolgáló osztály
 */

@Injectable({
  providedIn: 'root'
})
export class ParkingLotService {

  //Események emmittálására szolgáló adattagok
  parkingLotsAdded: Subject<Sector> = new Subject<Sector>();
  parkingLotsDeleted: Subject<boolean> = new Subject<boolean>();
  parkingLotUpdated: Subject<string> = new Subject<string>();
  parkedOut: Subject<ParkingLot> = new Subject<ParkingLot>();
  parkedIn: Subject<ParkingLot> = new Subject<ParkingLot>();
  errorOccured: Subject<string> = new Subject<string>();

  constructor(private sectorService: SectorService, private parkHouseService: ParkHouseService, private http: HttpClient, private commonService: CommonService) {

  }

  //Parkoló hozzáadása put kéréssel.
  addParkingLots(sector: Sector, newPls: ParkingLot[]): void {
    this.commonService.isLoading = true;
    this.http.put<Sector>(CommonData.hostUri + 'auth/sectors/addParkingLot/' + sector.id, newPls,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response => {
      console.log(response);
      this.commonService.isLoading = false;
      this.sectorService.adjustParkingLots(response);
      sector.parkingLots = response.parkingLots;
      sector.freePlCount=response.freePlCount;
      sector.parkHouse.freePlCount=response.parkHouse.freePlCount;
      this.parkingLotsAdded.next(sector);
    }, error => this.handleError(error));
  }

  //Parkoló eltávolítása
  removeParkingLot(parkinglot: ParkingLot): void {
    this.commonService.isLoading = true;
    this.http.delete<number>(CommonData.hostUri + 'auth/parkingLots/delete/' + parkinglot.id,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response => {
      this.commonService.isLoading = false;
      let index = parkinglot.sector.parkingLots.findIndex(elem => elem.id == response);
      parkinglot.sector.parkingLots.splice(index, 1);
      //Frissítjük a parkolóház számadatait.
      if(parkinglot.occupyingCar==null){
        let parkHouse:ParkHouse = this.parkHouseService.parkHouses.find(ph=>ph.id==parkinglot.sector.parkHouse.id);
        parkHouse.sectors.find(sec=>sec.id==parkinglot.sector.id).freePlCount--;
        parkHouse.freePlCount--;
      }else{
        parkinglot.sector.parkHouse.occupiedPlCount--;
      }
      this.parkingLotsDeleted.next(true);
      console.log(response);
    }, error => this.handleError(error));
  }

  //Parkló nevének szerkesztése.
  updateParkingLotName(parkinglot: ParkingLot, newName: string) {
    this.commonService.isLoading = true;
    this.http.put<ParkingLot>(CommonData.hostUri + 'auth/parkingLots/update/' + parkinglot.id, newName,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response => {
      this.commonService.isLoading = false;
      let index = parkinglot.sector.parkingLots.findIndex(elem => elem.id == response.id);
      parkinglot.sector.parkingLots[index].name = response.name;
      this.parkingLotUpdated.next(response.name);
    }, error => { this.handleError(error) })
  }

  //Kiparkolás put kéréssel a háttérszolgáltatás felé
  parkOut(parkingLot: ParkingLot) {
    if (parkingLot.occupyingCar) {
      this.commonService.isLoading = true;
      this.http.put<{
        parkingLot:ParkingLot,
        freePlCount:number,
        parkHouseFreePlCount:number,
        parkHouseOccupiedPlCount:number
      }>(CommonData.hostUri + 'auth/parkingLots/parkOut/' + parkingLot.id, null,{
        headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
      }).subscribe(response => {
        let index = parkingLot.sector.parkingLots.findIndex(elem => elem.id == response.parkingLot.id);
        parkingLot.sector.freePlCount = response.freePlCount;
        parkingLot.sector.parkHouse.freePlCount=response.parkHouseFreePlCount;
        parkingLot.sector.parkHouse.occupiedPlCount=response.parkHouseOccupiedPlCount;
        response.parkingLot.sector = parkingLot.sector;
        parkingLot.sector.parkingLots[index] = response.parkingLot;
        this.commonService.isLoading = false;
        this.parkedOut.next(response.parkingLot);
      }, error => this.handleError(error));
    }
  }

  //Beparkolás
  parkIn(parkingLot:ParkingLot, car:Car){
    this.commonService.isLoading=true;
    this.http.put<{parkingLot:ParkingLot, reservation:Reservation, car:Car, sectorPlCount:number,
      parkHouseFreePlCount:number,
      parkHouseOccupiedPlCount:number}>(CommonData.hostUri+'auth/parkingLots/parkIn/'+parkingLot.id+'/'+car.plateNumber, null,{
      headers: new HttpHeaders({'Authorization': `Basic ${this.commonService.authToken}`})
    }).subscribe(response=>{
      //A válasz alapján updateljük a felület modelljeit
      response.parkingLot.occupyingCar=response.car;
      response.car.occupiedParkingLot=response.parkingLot;
      let index = parkingLot.sector.parkingLots.findIndex(elem => elem.id == response.parkingLot.id);
      response.parkingLot.sector = parkingLot.sector;
      response.parkingLot.sector.freePlCount=response.sectorPlCount;
      parkingLot.sector.parkHouse.freePlCount=response.parkHouseFreePlCount;
      parkingLot.sector.parkHouse.occupiedPlCount=response.parkHouseOccupiedPlCount;
      response.parkingLot.reservation=response.reservation;
      parkingLot.sector.parkingLots[index] = response.parkingLot;

      if(car.occupiedParkingLot!=null){
        car.occupiedParkingLot.occupyingCar=null;
      }

      this.commonService.isLoading=false;
      this.parkedIn.next(response.parkingLot);
    }, error=>this.handleError(error));
  }

  handleError(error: HttpErrorResponse) {
    this.commonService.isLoading = false;
    console.log(error);
    switch (error.status) {
      case 0: this.errorOccured.next(CommonData.unknownErrorText); break;
      case 400: this.errorOccured.next(error.error.error); break;
      case 404: this.errorOccured.next("A parkoló nem található!"); break;
      case 500: this.errorOccured.next(error.error.error); break;
      default: this.errorOccured.next(error.message);
    }
  }
}
