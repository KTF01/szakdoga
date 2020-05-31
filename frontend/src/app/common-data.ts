import { environment } from '../environments/environment';
import { MapRestriction } from '@agm/core/services/google-maps-types';

/**
 * Globális statikusokat tartalmazó osztály
 */
export class CommonData{
  //Backend ipcíme és portja
  static hostUri: string = environment.backendHost;
  //Alkalmazás címe.
  static title: string = 'Parkoló kezelő';
  static unknownErrorText: string = "Ismeretlen hiba, a szerver valószínűleg nem elérhető!";
  //A térkép határai
  static maprRestriction:MapRestriction = { latLngBounds: { north: 47.7, south: 47.2, west: 18.7, east: 19.5 }, strictBounds: true };
  static convertTimeString(origTime:string):string{
    let time:Date= new Date(origTime);
      time = new Date(time.setTime(time.getTime()-time.getSeconds()*1000));
      let result:string = time.toLocaleString();
    return result;
  }
}
