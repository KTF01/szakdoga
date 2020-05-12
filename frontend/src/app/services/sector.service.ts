import { Injectable } from '@angular/core';
import { Sector } from '../models/Sector';
import { ParkingLot } from '../models/ParkingLot';
import { Car } from '../models/Car';
import { Reservation } from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class SectorService{

  sectors: Sector[];

  constructor() {
  }

  adjustParkingLotsWithCarsAndReservations(sector:Sector, cars:Car[], reservations:Reservation[]){
    for(let pl of sector.parkingLots){
      pl.sector=sector;
      if(pl.occupyingCar){
        let chosenCar:Car = cars.find(car=>car.occupiedParkingLot.id==pl.id);
        pl.occupyingCar=chosenCar;
        chosenCar.occupiedParkingLot=pl;
      }
      if(pl.reservation){
        let chosenReservation:Reservation = reservations.find(res=>res.parkingLot.id==pl.id);
        pl.reservation=chosenReservation;
        chosenReservation.parkingLot=pl;
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
