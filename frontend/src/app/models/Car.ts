import { User } from "./User";
import { ParkingLot } from "./ParkingLot";

export class Car{
  plateNumber:string;
  owner?:User;
  occupiedParkingLot?:ParkingLot;
}
