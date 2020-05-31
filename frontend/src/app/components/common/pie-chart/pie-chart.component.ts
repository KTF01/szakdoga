import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

/**
 * Kör diagrammot megjelenítő és kezelő komponens.
 */
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @Input() freePls:number;
  @Input() occuPiedPls:number;

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: true,
      position:"bottom"
    },
  };
  public pieChartLabels: Label[] = ['Foglalt', 'Szabad'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];


  constructor() { }

  ngOnInit(): void {
    this.pieChartData = [this.occuPiedPls,this.freePls];
  }


  public updateChart(free:number,occup:number){
    this.pieChartData=[occup,free];
  }
}
