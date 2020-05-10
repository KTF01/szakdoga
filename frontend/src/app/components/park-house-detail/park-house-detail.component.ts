import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ParkHouse } from '../../models/ParkHouse';
import { ActivatedRoute } from '@angular/router';
import { ParkHouseService } from '../../services/park-house.service';
import { Sector } from '../../models/Sector';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { ParkingLotListComponent } from '../parking-lot-list/parking-lot-list.component';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { PopUpContainer } from '../pop-up/PopUpContainer';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/Role';
import { CommonData } from '../../common-data';
import { MapRestriction } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-park-house-detail',
  templateUrl: './park-house-detail.component.html',
  styleUrls: ['./park-house-detail.component.css']
})
export class ParkHouseDetailComponent extends PopUpContainer implements OnInit {

  parkHouse: ParkHouse;
  formChecked: boolean = false;
  @ViewChild('ef') editForm: NgForm;
  @ViewChild('af') addForm: NgForm;

  error: string = null;

  faCaretDownIcon = faCaretDown;
  faCaretUpIcon = faCaretUp;
  editIcon = faEdit;
  deleteIcon = faTrash;

  isAdmin: boolean;

  mapRestriction:MapRestriction = CommonData.maprRestriction;

  constructor(private location: Location, private route: ActivatedRoute, private parkHouseService: ParkHouseService,
    private authService: AuthService) { super(); }

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    this.parkHouse = this.parkHouseService.getParkHouse(id);
    if (this.authService.loggedInUser) {
      this.isAdmin = !(this.authService.loggedInUser.role == Role.ROLE_USER);
    }
  }

  addNewSector(sector: Sector) {
    this.parkHouseService.addSectors(this.parkHouse, sector);
    this.parkHouseService.addedSectorToParkHouse.subscribe(_ => {
      this.parkHouse = this.parkHouseService.getParkHouse(this.parkHouse.id);
      this.closePopUp3();
    });
    this.parkHouseService.errorOccured.subscribe(errorText => {
      this.error = errorText;
    });

  }
  removeSector(sector: Sector) {
    this.parkHouseService.removeSector(this.parkHouse, sector);
    this.closePopUp4();
    this.parkHouseService.removedSectorToParkHouse.subscribe(_ => {
      this.closePopUp4();
    });
    this.parkHouseService.errorOccured.subscribe(errorText => {
      this.error = errorText;
    });
  }

  hidePlList(plList: ParkingLotListComponent): void {
    plList.parkingLotsVisible = !plList.parkingLotsVisible;
  }

  deleteParkHouse(): void {
    this.parkHouseService.removeParkHouse(this.parkHouse);
    this.parkHouseService.deletedParkHouse.subscribe(_ => {
      this.location.back();
    });
    this.parkHouseService.errorOccured.subscribe(errorText => {
      this.error = errorText;
    });

  }
  moveMarker(event) {
      let lo: number = +event.coords.lng;
      let la: number = +event.coords.lat;
      this.parkHouse.longitude = lo;
      this.parkHouse.latitude = la;
      //this.phMarkers.push({ longitude: lo, latitude: la });
  }

  dragMarker(event){
    let lo: number = +event.coords.lng;
      let la: number = +event.coords.lat;
      this.parkHouse.longitude = lo;
      this.parkHouse.latitude = la;
  }
  submitForm() {
    this.formChecked = true;
    if (this.editForm.valid) {
      this.editForm.ngSubmit.emit();
      this.closePopUp();
    } else {
      console.log(this.editForm);
    }
  }

  onSubmit() {
    let updatedParkHouse: ParkHouse = {
      id: this.parkHouse.id,
      name: this.editForm.value.parkHouseNameInput,
      address: this.editForm.value.parkHouseAddressInput,
      firstFloor: this.editForm.value.numFirstFloorInput,
      numberOfFloors: this.editForm.value.numFloorInput,
      sectors: this.parkHouse.sectors,
      longitude: this.editForm.value.longitudeInput,
      latitude : this.editForm.value.latitudeInput
    };
    this.parkHouseService.updateParkHouse(updatedParkHouse);
    this.parkHouseService.updatedParkHouse.subscribe(response => {
      this.parkHouse = response;//A backendtől visszajött módosított parkolóház!
      this.closePopUp2();
    });
    this.parkHouseService.errorOccured.subscribe(errorText => {
      this.error = errorText;
    });

  }

  submitAddForm() {
    this.error = null;
    if (this.addForm.valid && this.validateAddSectorForm(this.addForm)) {
      this.addForm.ngSubmit.emit();
    } else {
      this.error='Invalid form!';
    }
  }

  private validateAddSectorForm(form:NgForm): boolean {
    let returnValue = form.value.sectorFloorInput<=this.parkHouse.firstFloor+this.parkHouse.numberOfFloors &&
    form.value.sectorFloorInput>=this.parkHouse.firstFloor;
    return returnValue;
  }

  onAddSubmit() {
    let sector: Sector = {
      name: this.addForm.value.sectorNameInput,
      floor: this.addForm.value.sectorFloorInput,
      parkingLots: [],
      parkHouse: null
    }
    this.addNewSector(sector);
  }


  closePopUp() {
    this.popupIsOpen = false;
    this.error = null;
  }
  closePopUp2() {
    this.popUp2IsOpen = false;
    this.error = null;
  }
  closePopUp3() {
    this.popUp3IsOpen = false;
    this.error = null;
  }
  closePopUp4() {
    this.popUp4IsOpen = false;
    this.error = null;
  }

}
