import { Sector } from "./Sector";

export class ParkHouse{
  id?: number;
  name: string;
  address: string;
  numberOfFloors: number;
  sectors: Sector[];
}
