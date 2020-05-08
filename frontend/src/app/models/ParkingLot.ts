import { Car } from "./Car";
import { Sector } from "./Sector";
import { ParkingLotStatus } from "./ParkingLotStatus";

export class ParkingLot{
  id?: number;
  name: string;
  occupiingCar: Car;
  sector: Sector;
  status: ParkingLotStatus;
}
