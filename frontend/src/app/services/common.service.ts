import { Injectable } from '@angular/core';

/**
 * Általános közös elérésű kiszolgáló.
 */
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  //Történik e épp valami asyncron művelet amit meg akarunk jeleníteni.
  isLoading:boolean=false;
  //Az elkódolt email és jelszó ami azonosítja felhasználót. Ha null akkor nincs bejelentkezve.
  authToken:string=null;
  loggedInId:number = null;

  //Szköz koordinátái. Ha null-ok akkor nem elérhetőek.
  authLongitude:number;
  authLatitude:number;
  //Elérhetőséget egy bool is leírja.
  isLocationAvailable:boolean = true;
  constructor() { }
}
