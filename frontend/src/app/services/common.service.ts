import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isLoading:boolean=false;
  authToken:string=null;
  constructor() { }
}
