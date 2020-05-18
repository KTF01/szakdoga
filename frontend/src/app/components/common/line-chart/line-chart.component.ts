import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, ChartPoint } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { TimeLog } from '../../../models/TimeLog';
import { ParkHouseService } from '../../../services/park-house.service';
import { ParkHouse } from '../../../models/ParkHouse';
import { TimeLogService } from '../../../services/time-log.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  @Input() timeLogs: TimeLog[];

  selectedParkHouse: ParkHouse;

  public lineChartData: ChartDataSets[] = [];

  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May',];
  public lineChartOptions: ChartOptions = {};

  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // red
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

  updateChart() {
    let chartDatas: ChartDataSets[] = [{ data: [], label: "Szabad parkolók", cubicInterpolationMode:"monotone" },
    { data: [], label: "Foglalt parkolók", cubicInterpolationMode:"monotone" }];
    this.lineChartOptions = {
      responsive: true,
      scales: {
        xAxes: [{ id: 'x-axis-1', type: 'time',
        distribution: "linear",
        time: {
          unit:"minute",
          displayFormats:{
            minute:'YYYY-MM-DD HH:mm'
           // minute:'hh:mm'
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
        let chartPointFree: ChartPoint = { x: timeLog.time, y: timeLog.parkHouseFreePlCount };
        let chartPointOccupied: ChartPoint = { x: timeLog.time, y: timeLog.parkHouseOccupiedPlCount };
        (chartDatas[0].data as ChartPoint[]).push(chartPointFree);
        (chartDatas[1].data as ChartPoint[]).push(chartPointOccupied);
      }
    });
    this.lineChartLabels = labels;
    this.lineChartData = chartDatas;
  }
  convertDate(time: string) {
    let timedate: Date = new Date(time);
    return timedate.toLocaleString();
  }
  setSelectedParkHouse(ph: ParkHouse) {
    if (this.selectedParkHouse != null && ph.id != this.selectedParkHouse.id) {
      this.selectedParkHouse = ph;
      this.updateChart();
    }
  }
}
