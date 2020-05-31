import { Injectable } from '@angular/core';
import { Sector } from '../models/Sector';
import { Car } from '../models/Car';
import { Reservation } from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class SectorService{

  constructor() {
  }

  //A szektor parkolóinak ténylegesen beállítja a paraméterben kapot autókat és foglalásokat.
  //Fel van téve, hogy a kapott autók és foglalások hivatkoznak valamelyik parkolónak az id-jára.
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

  //A parkolók szektor adattagját beállítja a paraméterben kapott szektorra
  adjustParkingLots(sector:Sector){
    for(let pl of sector.parkingLots){
      pl.sector=sector;
    }
  }


}
