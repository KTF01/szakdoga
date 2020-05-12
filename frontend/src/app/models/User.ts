import { Car } from "./Car";
import { Role } from "./Role";
import { Reservation } from "./Reservation";

export class User{
  id?:number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  ownedCars?: Car[];
  role?: Role;
  longitude?: number;
  latitude?:number;
  reservations?:Reservation[];
}
