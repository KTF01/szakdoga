import { Component, OnInit, ViewChild } from '@angular/core';
import { ParkingLot } from '../../models/ParkingLot';
import { ParkingLotService } from '../../services/parking-lot.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PopUpContainer } from '../pop-up/PopUpContainer';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-parking-lot-detail',
  templateUrl: './parking-lot-detail.component.html',
  styleUrls: ['./parking-lot-detail.component.css']
})
export class ParkingLotDetailComponent extends PopUpContainer implements OnInit {

  parkingLot: ParkingLot;
  editIcon = faEdit;

  @ViewChild('form') editForm: NgForm;

  constructor(private parkingLotService: ParkingLotService, private route:ActivatedRoute, private location:Location,
    private router: Router) { super();}

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    this.parkingLot=this.parkingLotService.getParkingLot(id);
  }

  deleteParkingLot(){
    console.log(this.parkingLot);
    this.parkingLotService.removeParkingLot(this.parkingLot);
    this.parkingLotService.parkingLotsDeleted.subscribe(_=>{
      this.closePopUp();
      this.router.navigate(['../../'], {relativeTo:this.route});
    });

  }

  submitEditForm(){
    if(this.editForm.valid){
      this.editForm.ngSubmit.emit();
    }else{
      console.log("INVALID");
    }
  }

  onEditSubmit(){
    this.parkingLotService.updateParkingLotName(this.parkingLot, this.editForm.value.newNameInput);
    this.parkingLotService.parkingLotUpdated.subscribe(newName=>{
      this.parkingLot.name=newName;
      this.closePopUp2();
    })
  }
}
