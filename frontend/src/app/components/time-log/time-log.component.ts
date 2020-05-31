import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TimeLogService } from '../../services/time-log.service';
import { CommonService } from '../../services/common.service';
import { faSearch, faCaretDown, faCaretUp, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LineChartComponent } from '../common/line-chart/line-chart.component';

/**
 * Napló felület megjelenítéséért felelős komponens.
 */

@Component({
  selector: 'app-time-log',
  templateUrl: './time-log.component.html',
  styleUrls: ['./time-log.component.css']
})
export class TimeLogComponent implements OnInit {

  //A lista alatti grafikon.
  @ViewChild("lineChart") lineChart: LineChartComponent;

  //ikonok
  searchIcon: IconDefinition = faSearch;
  downIcon: IconDefinition = faCaretDown;
  logsLoaded: Subscription = new Subscription();

  //Egyedi időkre keres a felhasználó vagy az előre megadottakra.
  isDetailedSearch: boolean = false;
  //Megjelenítsük-e a grafikont vagy ne.
  isChartReady: boolean = false;
  constructor(public timeLogService: TimeLogService, public commonService: CommonService) { }

  ngOnInit(): void {
    let startDateString: string = "";
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    startDateString = new Date(Date.now() - tzoffset - 3600000).toISOString();
    this.timeLogService.loadFilteredLogs("",
      "ALL" as any,
      startDateString,
      "");
    this.logsLoaded = this.timeLogService.logsLoaded.subscribe((_) => {
      //Ha nincs bejegyzés ne jelenítsük meg a grafikont.
      if (this.timeLogService.timeLogs.length > 0) {
        this.isChartReady = true;
      }
      this.logsLoaded.unsubscribe();
    });
  }

  convertDate(time: string) {
    let timedate: Date = new Date(time);
    return timedate.toLocaleString();
  }

  //Logok keresése megkezdődik
  submitFilterForm(form: NgForm) {
    //Ha specifikus időintervallumra keresünk akkor mindent átadunk, úgy ahogy jön a formból
    if (this.isDetailedSearch) {
      this.timeLogService.loadFilteredLogs(form.value.textSearchInput,
        form.value.actionSelectInput,
        form.value.statTimeInput,
        form.value.endTimeInput);
      this.logsLoaded = this.timeLogService.logsLoaded.subscribe((_) => {
        this.lineChart.updateChart();
        this.logsLoaded.unsubscribe();
      });
      //Ha nem akkor megkonstuáljuk az időpontokat.
    } else {
      let startDateString: string = "";
      let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      switch (form.value.basicTimeInput) {
        case '0':
          //Elmúlt egy óra -> jelenlegi idő - 3600000 miliszekundum. (offsset: az időzóna miatt szükséges)
          startDateString = new Date(Date.now() - tzoffset - 3600000).toISOString();
          break;
        case '1':
          //többi hasonlóan
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
          if (form.value.textSearchInput == "") {
            //Ha nem adunk meg semmi paramétert, akkor minden bejegyzést lekérdezünk.
            this.timeLogService.loadAllTimeLog();
            this.logsLoaded = this.timeLogService.logsLoaded.subscribe((_) => {
              if (this.timeLogService.timeLogs.length <= 0) {
                this.isChartReady = false;
              }
              else if (this.lineChart) {
                this.isChartReady = true;
                this.lineChart.updateChart();
              };
              this.logsLoaded.unsubscribe();
            });
            return;
          }else{
            break;
          }
      }

      this.timeLogService.loadFilteredLogs(form.value.textSearchInput,
        form.value.actionSelectInput,
        startDateString,
        "");
      this.logsLoaded = this.timeLogService.logsLoaded.subscribe((_) => {
        if (this.timeLogService.timeLogs.length <= 0) {
          this.isChartReady = false;
        } else {
          this.isChartReady = true;
          if (this.lineChart) this.lineChart.updateChart();
        }
        this.logsLoaded.unsubscribe();
      });
    }

  }

  //Felcseréljük az időpontok szerinti sorrendet.
  changeOrder() {
    if (this.downIcon == faCaretDown) this.downIcon = faCaretUp;
    else this.downIcon = faCaretDown
    this.timeLogService.timeLogs.reverse();
  }
  
  checkCheckbox(event) {
    console.log(event);
  }
}
