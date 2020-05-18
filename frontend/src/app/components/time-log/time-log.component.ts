import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TimeLogService } from '../../services/time-log.service';
import { CommonService } from '../../services/common.service';
import { faSearch, faCaretDown, faCaretUp, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LineChartComponent } from '../common/line-chart/line-chart.component';

@Component({
  selector: 'app-time-log',
  templateUrl: './time-log.component.html',
  styleUrls: ['./time-log.component.css']
})
export class TimeLogComponent implements OnInit {

  @ViewChild("lineChart") lineChart: LineChartComponent;

  searchIcon: IconDefinition = faSearch;
  downIcon: IconDefinition = faCaretDown;
  logsLoaded: Subscription = new Subscription();

  isDetailedSearch: boolean = false;
  constructor(public timeLogService: TimeLogService, public commonService: CommonService) { }

  ngOnInit(): void {
    let startDateString: string = "";
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    startDateString = new Date(Date.now() - tzoffset - 3600000).toISOString();
    this.timeLogService.loadFilteredLogs("",
      "ALL" as any,
      startDateString,
      "");
  }

  convertDate(time: string) {
    let timedate: Date = new Date(time);
    return timedate.toLocaleString();
  }

  submitFilterForm(form: NgForm) {
    if (this.isDetailedSearch) {
      this.timeLogService.loadFilteredLogs(form.value.textSearchInput,
        form.value.actionSelectInput,
        form.value.statTimeInput,
        form.value.endTimeInput);
    } else {
      let startDateString: string = "";
      let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      switch (form.value.basicTimeInput) {
        case '0':
          startDateString = new Date(Date.now() - tzoffset - 3600000).toISOString();
          break;
        case '1':
          startDateString = new Date(Date.now() - tzoffset - 86400000).toISOString();
          break;
        case '2':
          startDateString = new Date(Date.now() - tzoffset - 604800000).toISOString();
          break;
        case '3':
          startDateString = new Date(Date.now() - tzoffset - 4 * 604800000).toISOString();
          break;
        case '4':
          startDateString = new Date(Date.now() - tzoffset - 365 * 604800000).toISOString();
          break;
        default:
        if(form.value.textSearchInput==""){
          this.timeLogService.loadAllTimeLog();
          this.logsLoaded = this.timeLogService.logsLoaded.subscribe((_) => {
            this.lineChart.updateChart();
            this.logsLoaded.unsubscribe();
          });
          return;
        }
      }

      this.timeLogService.loadFilteredLogs(form.value.textSearchInput,
        form.value.actionSelectInput,
        startDateString,
        "");
      this.logsLoaded = this.timeLogService.logsLoaded.subscribe((_) => {
        this.lineChart.updateChart();
        this.logsLoaded.unsubscribe();
      });
    }

  }

  changeOrder() {
    if (this.downIcon == faCaretDown) this.downIcon = faCaretUp;
    else this.downIcon = faCaretDown
    this.timeLogService.timeLogs.reverse();
  }

  checkCheckbox(event) {
    console.log(event);
  }
}
