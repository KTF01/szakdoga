import { Injectable } from '@angular/core';
import { Sector } from '../models/Sector';
import { ParkingLot } from '../models/ParkingLot';
import { Car } from '../models/Car';

@Injectable({
  providedIn: 'root'
})
export class SectorService{

  sectors: Sector[];

  constructor() {
  }

  adjustParkingLotsWithCars(sector:Sector, cars:Car[]){
    for(let pl of sector.parkingLots){
      pl.sector=sector;
      if(pl.occupiingCar){
        let chosenCar:Car = cars.find(car=>car.occupiedParkingLot.id==pl.id);
        pl.occupiingCar=chosenCar;
        chosenCar.occupiedParkingLot=pl;
      }
    }
  }

  adjustParkingLots(sector:Sector){
    for(let pl of sector.parkingLots){
      pl.sector=sector;
    }
  }

  addParkingLotToSector(sector:Sector, parkingLot: ParkingLot){
    parkingLot.sector=sector;
    sector.parkingLots.push(parkingLot);
  }

}
