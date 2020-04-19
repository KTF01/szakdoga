import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TimeLog } from '../models/TimeLog';
import { CommonData } from '../common-data';
import { CommonService } from './common.service';
import { Subject } from 'rxjs';
import { LogAction } from '../models/LogAction';

@Injectable({
  providedIn: 'root'
})
export class TimeLogService {

  timeLogs: TimeLog[] = [];
  logsLoaded: Subject<boolean> = new Subject<boolean>();
  errorOccured: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient, private commonService: CommonService) { }

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

  loadFilteredLogs(userName: string, action: LogAction, startTime: string, endTime: string) {

    this.commonService.isLoading=true;
    let myParams:HttpParams = new HttpParams();

    if(startTime===""){
      startTime = new Date(0).toISOString();
    }
    if(endTime===""){
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      endTime = (new Date(Date.now() - tzoffset)).toISOString();
    }
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
    }, error=>{
      this.commonService.isLoading=false;
      console.log(error);
    });
  }
}
