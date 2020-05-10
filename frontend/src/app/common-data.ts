import { environment } from '../environments/environment';
import { MapRestriction } from '@agm/core/services/google-maps-types';
export class CommonData{
  static hostUri: string = environment.backendHost;
  static title: string = 'Parkoló kezelő';
  static isLoading:boolean=false;
  static authLongitude:number;
  static authLatitude:number;
  static maprRestriction:MapRestriction = { latLngBounds: { north: 47.7, south: 47.2, west: 18.7, east: 19.5 }, strictBounds: true };
}
