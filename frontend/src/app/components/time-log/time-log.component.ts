import { Component, OnInit } from '@angular/core';
import { TimeLogService } from '../../services/time-log.service';
import { CommonService } from '../../services/common.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-time-log',
  templateUrl: './time-log.component.html',
  styleUrls: ['./time-log.component.css']
})
export class TimeLogComponent implements OnInit {

  searchIcon = faSearch;

  constructor(public timeLogService:TimeLogService, public commonService:CommonService) { }

  ngOnInit(): void {
    this.timeLogService.loadAllTimeLog();
  }

  convertDate(time:string){
    let timedate:Date= new Date(time);
    return timedate.toLocaleString();
  }

  submitFilterForm(form:NgForm){
    console.log(form);
    this.timeLogService.loadFilteredLogs(form.value.userNameInput, form.value.actionSelectInput,form.value.statTimeInput, form.value.endTimeInput);
  }

}
