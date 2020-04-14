import { Car } from "./Car";
import { Role } from "./Role";

export class User{
  id?:number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  ownedCars?: Car[];
  role?: Role;
}
