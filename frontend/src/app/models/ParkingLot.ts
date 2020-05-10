import { Car } from "./Car";
import { Sector } from "./Sector";
import { Reservation } from "./Reservation";

export class ParkingLot{
  id?: number;
  name: string;
  occupiingCar: Car;
  sector: Sector;
  isReserved: Boolean;
  reservation?: Reservation;
}
