import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ParkHouse } from '../../models/ParkHouse';
import { ParkHouseService } from '../../services/park-house.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PopUpContainer } from '../pop-up/PopUpContainer';
import { Sector } from '../../models/Sector';
import { CommonService } from '../../services/common.service';
import { ListTileComponent } from '../list-tile/list-tile.component';

@Component({
  selector: 'app-park-houses',
  templateUrl: './park-houses.component.html',
  styleUrls: ['./park-houses.component.css']
})
export class ParkHousesComponent extends PopUpContainer implements OnInit {

  parkHouses: ParkHouse[];
  formChecked: boolean = false;
  errorText: string=null;
  error:string=null;

  @ViewChild('f') form: NgForm;
  @ViewChildren('listTile') tile:QueryList<ListTileComponent>;

  constructor(private parkHouseService: ParkHouseService, private route: ActivatedRoute, private router: Router,
    public commonService:CommonService) { super(); }

  ngOnInit(): void {
    this.parkHouseService.loadParkHouses();
      this.parkHouseService.loadedParkHouses.subscribe(_=>{
        this.parkHouses = this.parkHouseService.parkHouses;
      });
      this.parkHouseService.errorOccured.subscribe(errorMessage=>{
        this.error=errorMessage;
        console.log(this.error);
      });


  }
  addParkHouse(parkHouse: ParkHouse): void {
    this.commonService.isLoading=true;
    this.parkHouseService.addNewParkHouse(parkHouse);
    this.parkHouseService.addedParkHouse.subscribe(_=>{
      this.commonService.isLoading=false;
      this.closePopUp();
    })
    this.parkHouseService.errorOccured.subscribe(error=>{
      console.log(error);
      this.errorText=error;
    });
  }

  deleteParkHouse(parkHouse: ParkHouse, INDEX:number): void {
    this.commonService.isLoading = true;
    this.parkHouseService.removeParkHouse(parkHouse);

    this.parkHouseService.deletedParkHouse.subscribe(_ => {
      this.commonService.isLoading = false;
      this.closePopUp2();
    });
    this.parkHouseService.errorOccured.subscribe(error=>{
      this.tile.toArray()[INDEX].errorDisplay=error;
    })
  }

  openParkHouseDetail(parkHouse): void {
    this.router.navigate(['parkHouse', parkHouse.id], { relativeTo: this.route });
  }

  submitForm() {
    this.formChecked = true;
    if (this.form.valid) {
      this.form.ngSubmit.emit(this.form);
      this.formChecked=false;
    } else {
      console.log(this.form);
    }
  }

  onSubmit() {
    let newParkhouse: ParkHouse = {
      name: this.form.value.parkHouseNameInput,
      address: this.form.value.parkHouseAddressInput,
      numberOfFloors: this.form.value.numFloorInput,
      sectors: []
    }
    this.addParkHouse(newParkhouse);

  }

  closePopup(): void {
    this.formChecked = false;
    this.popupIsOpen = false;
  }
}
