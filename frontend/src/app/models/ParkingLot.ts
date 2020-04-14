import { Car } from "./Car";
import { Sector } from "./Sector";

export class ParkingLot{
  id?: number;
  name: string;
  occupiingCar: Car;
  sector: Sector
}
