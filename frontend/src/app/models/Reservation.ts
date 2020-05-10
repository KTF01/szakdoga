import { User } from "./User";
import { ParkingLot } from "./ParkingLot";

export class Reservation{
  id:number;
  startTime:Date;
  endTime:Date;
  user:User;
  parkingLot:ParkingLot;
}
