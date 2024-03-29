import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, ChartPoint } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { TimeLog } from '../../../models/TimeLog';
import { ParkHouseService } from '../../../services/park-house.service';
import { ParkHouse } from '../../../models/ParkHouse';
import { TimeLogService } from '../../../services/time-log.service';

/**
 * A vonal grafikont megejlenítő és beállító komponens.
 */
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  @Input() timeLogs: TimeLog[];

  selectedParkHouse: ParkHouse;

  public lineChartData: ChartDataSets[] = [];

  public lineChartLabels: Label[]=[];
  public lineChartOptions: ChartOptions = {};

  public lineChartColors: Color[] = [
    { // piros
      backgroundColor: 'rgba(0,0,159,0.2)',
      borderColor: 'rgba(0,0,255,1)',
      pointBackgroundColor: 'rgba(0,0,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // kék
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public lineChartLegend = true;
  public chartType: ChartType = 'line';

  constructor(public parkHouseService: ParkHouseService, private timeLogService: TimeLogService) { }

  ngOnInit(): void {
    this.selectedParkHouse = this.parkHouseService.parkHouses[0];
    this.updateChart();
  }

  //A grafikon újboli kirajzolása.
  updateChart() {
    let chartDatas: ChartDataSets[] = [{ data: [], label: "Szabad parkolók",
    cubicInterpolationMode:"monotone", lineTension:0, hidden: true },
    { data: [], label: "Foglalt parkolók", cubicInterpolationMode:"monotone", lineTension:0 }];
    //Konfigurációs objektum.
    this.lineChartOptions = {
      responsive: true,
      scales: {
        xAxes: [{ id: 'x-axis-1', type: 'time',
        distribution: "linear",
        time: {
          tooltipFormat: 'YYYY-MM-DD HH:mm',
          unit:"minute",
          displayFormats:{
            minute:'YYYY-MM-DD HH:mm'
          }
        },
        ticks: { maxTicksLimit: 4 } }],
        yAxes: [
          {
            id: 'y-axis-1',
            position: 'left',
            ticks: {
              stepSize: 1,
              fontColor: 'red',
              min: 0,
              max: this.selectedParkHouse.freePlCount + this.selectedParkHouse.occupiedPlCount
            }
          }
        ]
      },

    };
    let labels: Label[] = [];
    this.timeLogService.timeLogs.forEach((timeLog) => {
      if (timeLog.parkHouseId == this.selectedParkHouse.id) {
        let chartPointFree: ChartPoint = { x: timeLog.time.toLocaleString(), y: timeLog.parkHouseFreePlCount, };
        let chartPointOccupied: ChartPoint = { x: timeLog.time.toLocaleString(), y: timeLog.parkHouseOccupiedPlCount };
        (chartDatas[0].data as ChartPoint[]).push(chartPointFree);
        (chartDatas[1].data as ChartPoint[]).push(chartPointOccupied);
      }
    });
    this.lineChartLabels = labels;
    this.lineChartData = chartDatas;
  }
  //Idő szöveget átkonvertál helyi formátumúra: magyar->2020. XX. XX
  convertDate(time: string) {
    let timedate: Date = new Date(time);
    return timedate.toLocaleString();
  }
  //A grafikon által megjelenített parkolóház módosítása.
  setSelectedParkHouse(ph: ParkHouse) {
    if (this.selectedParkHouse != null && ph.id != this.selectedParkHouse.id) {
      this.selectedParkHouse = ph;
      this.updateChart();
    }
  }
}
