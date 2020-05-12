import { Car } from "./Car";
import { Sector } from "./Sector";
import { Reservation } from "./Reservation";

export class ParkingLot{
  id?: number;
  name: string;
  occupyingCar: Car;
  sector: Sector;
  isReserved: boolean;
  reservation?: Reservation;
}
