import { ParkHouse } from "./ParkHouse";
import { ParkingLot } from "./ParkingLot";

export class Sector{
  id?: number;
  name: string;
  floor: number;
  parkingLots : ParkingLot[];
  parkHouse: ParkHouse;
}
