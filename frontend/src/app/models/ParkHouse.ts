import { Sector } from "./Sector";

export class ParkHouse{
  id?: number;
  name: string;
  address: string;
  firstFloor: number;
  numberOfFloors: number;
  freePlCount?: number;
  sectors: Sector[];
  longitude:number;
  latitude: number;
}
