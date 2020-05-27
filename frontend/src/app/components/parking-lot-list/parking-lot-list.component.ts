import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { ParkingLot } from '../../models/ParkingLot';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { Sector } from '../../models/Sector';
import { Router, ActivatedRoute } from '@angular/router';
import { PopUpContainer } from '../common/pop-up/PopUpContainer';
import { NgForm, NgModel } from '@angular/forms';
import { ParkingLotService } from '../../services/parking-lot.service';
import { PieChartComponent } from '../common/pie-chart/pie-chart.component';

@Component({
  selector: 'app-parking-lot-list',
  templateUrl: './parking-lot-list.component.html',
  styleUrls: ['./parking-lot-list.component.css']
})
export class ParkingLotListComponent extends PopUpContainer implements OnInit {

  @Input() parkigLots: ParkingLot[];
  @Input() sector: Sector;
  @Input() chart:PieChartComponent;

  faCar = faCar;

  @Output() parkingLotsVisible: boolean = false;

  @ViewChild('plName') plInitInput: NgModel;
  @ViewChild('form') form: NgForm;

  inputCount: number[] = [0];

  constructor(private parkingLotService:ParkingLotService, private router: Router, private route: ActivatedRoute) { super(); }

  ngOnInit(): void {
    if(this.chart) this.chart.updateChart(this.sector.parkHouse.freePlCount, this.sector.parkHouse.occupiedPlCount);
  }
  novigateToParkingLotDetail(parkingLot: ParkingLot) {
    this.router.navigate(['parkingLot', parkingLot.id], { relativeTo: this.route });
  }

  addInputToForm(): void {
    this.inputCount.push(1);
  }

  removeInputFromForm() {
    this.inputCount.pop();
  }

  submitAddPlForm() {
    let newParkingLots: ParkingLot[] = [];
    for (let inputName in this.form.value) {
      if(this.form.value[inputName]!==""){
        newParkingLots.push({
          name: this.form.value[inputName],
          occupyingCar: null,
          sector: null,
          isReserved:false,
        });
      }

    }

    this.parkingLotService.addParkingLots(this.sector, newParkingLots);
    this.parkingLotService.parkingLotsAdded.subscribe(sector=>{
      this.closePopUp();
      this.chart.updateChart(sector.parkHouse.freePlCount, sector.parkHouse.occupiedPlCount);
    });

  }
}
