import { environment } from '../environments/environment';
export class CommonData{
  static hostUri: string = environment.backendHost;
  static title: string = 'Parkoló kezelő';
  static isLoading:boolean=false;
  static authLongitude:number;
  static authLatitude:number;
}
