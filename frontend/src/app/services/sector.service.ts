import { Injectable } from '@angular/core';
import { Sector } from '../models/Sector';
import { ParkingLot } from '../models/ParkingLot';
import { ParkingLotService } from './parking-lot.service';

@Injectable({
  providedIn: 'root'
})
export class SectorService{

  sectors: Sector[];

  constructor() {
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
