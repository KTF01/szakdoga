import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TimeLog } from '../models/TimeLog';
import { CommonData } from '../common-data';
import { CommonService } from './common.service';
import { Subject } from 'rxjs';
import { LogAction } from '../models/LogAction';
import { Router } from '@angular/router';

/**
 * Naplóbejegyzéseket kezelő service.
 */

@Injectable({
  providedIn: 'root'
})
export class TimeLogService {

  //A betöltött bejegyzések
  timeLogs: TimeLog[] = [];

  logsLoaded: Subject<boolean> = new Subject<boolean>();
  errorOccured: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient, private commonService: CommonService, private router:Router) { }

  //Az összes bejegyzés lekérdezése szűrés nélkül.
  loadAllTimeLog() {
    this.commonService.isLoading = true;
    this.http.get<TimeLog[]>(CommonData.hostUri + 'auth/logs/all', {
      headers: new HttpHeaders({ 'Authorization': `Basic ${this.commonService.authToken}` })
    }).subscribe(response => {
      this.timeLogs = response;
      this.logsLoaded.next(true);
      this.commonService.isLoading = false;
    }, error => {
      this.commonService.isLoading = false;
      console.log(error);
      this.errorOccured.next(error);
    })
  }

  //Bejegyzések lekérdezése szűrési feltételek figyelembevételével.
  loadFilteredLogs(userName: string, action: LogAction, startTime: string, endTime: string) {

    this.commonService.isLoading=true;
    let myParams:HttpParams = new HttpParams();

    //Ha nincs megadva kezdő idő akkor a 0 miliszekundumnak megfelelő idő lesz az. (1970. 01. 01)
    if(startTime===""){
      startTime = new Date(0).toISOString();
    }
    //Ha nincs megadva vége idő akkor a mostani időpont lesz az.
    if(endTime===""){
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      endTime = (new Date(Date.now() - tzoffset)).toISOString();
    }
    //Querry paraméterekben mennek a keresési feltételek.
    myParams=myParams.append("userName", userName);
    myParams=myParams.append("action", action.toString());
    myParams=myParams.append("startTime", startTime);
    myParams=myParams.append("endTime", endTime);
    this.http.get<TimeLog[]>(CommonData.hostUri + 'auth/logs/filter', {
      headers: new HttpHeaders({ 'Authorization': `Basic ${this.commonService.authToken}` }),
      params: myParams
    }).subscribe(response=>{
      this.commonService.isLoading=false;
      this.timeLogs=response;
      this.logsLoaded.next(true);
    }, error=>{
      this.commonService.isLoading=false;
      if(error.status==0){
        this.router.navigate(["/login"]);
      }
      console.log(error);
    });
  }
}
