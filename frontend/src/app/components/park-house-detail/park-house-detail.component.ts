import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ParkHouse } from '../../models/ParkHouse';
import { ActivatedRoute } from '@angular/router';
import { ParkHouseService } from '../../services/park-house.service';
import { Sector } from '../../models/Sector';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { ParkingLotListComponent } from '../parking-lot-list/parking-lot-list.component';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { PopUpContainer } from '../common/pop-up/PopUpContainer';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/Role';
import { CommonData } from '../../common-data';
import { MapRestriction } from '@agm/core/services/google-maps-types';
import { PieChartComponent } from '../common/pie-chart/pie-chart.component';
import { Subscription } from 'rxjs';

/**
 * A parkolóház adatait és szektorait megjelenítő komponens
 */
@Component({
  selector: 'app-park-house-detail',
  templateUrl: './park-house-detail.component.html',
  styleUrls: ['./park-house-detail.component.css']
})
export class ParkHouseDetailComponent extends PopUpContainer implements OnInit {

  parkHouse: ParkHouse;
  formChecked: boolean = false;

  //Szerkesztő és hozzáadó űrlapok.
  @ViewChild('ef') editForm: NgForm;
  @ViewChild('af') addForm: NgForm;

  //A kördiagramm modellje
  @ViewChild('chart') chart: PieChartComponent;

  error: string = null;

  //Parkolóház legfelső emelete.
  maxFloor:number;

  //FontAwsome ikonok
  faCaretDownIcon = faCaretDown;
  faCaretUpIcon = faCaretUp;
  editIcon = faEdit;
  deleteIcon = faTrash;

  isAdmin: boolean;

  //A térképen való navigálásnak a korlátai
  mapRestriction:MapRestriction = CommonData.maprRestriction;

  removeSectorSub:Subscription = new Subscription();

  constructor(private location: Location, private route: ActivatedRoute, private parkHouseService: ParkHouseService,
    private authService: AuthService) { super(); }

  //Inicializáláskor betöltjük a megfelelő parkolóházat,
  //eldöntjük, hogy admin e a felhasználó és megállapítjuk, hogy melyik a legfelső emelet.
  ngOnInit(): void {

    let id = +this.route.snapshot.params['id'];
    this.parkHouse = this.parkHouseService.getParkHouse(id);
    if (this.authService.loggedInUser) {
      this.isAdmin = !(this.authService.loggedInUser.role == Role.ROLE_USER);
    }
    this.maxFloor =  this.parkHouse.firstFloor+this.parkHouse.numberOfFloors;
  }

  //Kiszolgálóhoz való kérés, új szektor létrehozásáról.
  addNewSector(sector: Sector) {
    this.parkHouseService.addSectors(this.parkHouse, sector);
    this.parkHouseService.addedSectorToParkHouse.subscribe(newSector => {
      this.parkHouse = this.parkHouseService.getParkHouse(this.parkHouse.id);
      this.closePopUp3();
    });
    this.parkHouseService.errorOccured.subscribe(errorText => {
      this.error = errorText;
    });

  }

  //Szektor eltávolítása
  removeSector(sector: Sector) {
    this.parkHouseService.removeSector(this.parkHouse, sector);
    this.closePopUp4();
    this.removeSectorSub= this.parkHouseService.removedSectorToParkHouse.subscribe(_ => {
      this.closePopUp4();
      //Ilyenkor megváltoznak a parkolóházban lévő számadatok ezért frissíteni kell a kördiagrammot.
      this.chart.updateChart(this.parkHouse.freePlCount, this.parkHouse.occupiedPlCount);
      this.removeSectorSub.unsubscribe();
    });
    this.parkHouseService.errorOccured.subscribe(errorText => {
      this.error = errorText;
    });
  }

  //Parkolók listáját ki be lehet csukni, ha a szektorokra kattintunk.
  togglePlList(plList: ParkingLotListComponent): void {
    plList.parkingLotsVisible = !plList.parkingLotsVisible;
  }

  //Parkolóház törlése
  deleteParkHouse(): void {
    this.parkHouseService.removeParkHouse(this.parkHouse);
    this.parkHouseService.deletedParkHouse.subscribe(_ => {
      //törlés után visszanavigálunk a parkolóházak oldalára.
      this.location.back();
    });
    this.parkHouseService.errorOccured.subscribe(errorText => {
      this.error = errorText;
    });

  }

  //A jelzők mozgatának eseménye a térképen dupla kattintáskor történik.
  moveMarker(event) {
      let lo: number = +event.coords.lng;
      let la: number = +event.coords.lat;
      this.parkHouse.longitude = lo;
      this.parkHouse.latitude = la;
  }

  //Jelzők húzogatása a térképen.
  dragMarker(event){
    let lo: number = +event.coords.lng;
      let la: number = +event.coords.lat;
      this.parkHouse.longitude = lo;
      this.parkHouse.latitude = la;
  }

  //Parkolóház szerkesztési űrlapjának ellenőrzése és elküldése
  submitForm() {
    this.formChecked = true;
    if (this.editForm.valid) {
      //További ellenőrzések szükségesek
      if(this.editFormExtraValidate()){
        this.editForm.ngSubmit.emit();
        this.closePopUp();
      }else{
        this.error="A koordinátáknak Budapesten belül kell lennie! A térképre duplán kattintva kijelölhet pontos helyet.";
      }
    } else {
      this.error="Helytelen az űrlap";
    }
  }

  //A parkolóház a térkép korlátain belül van-e
  editFormExtraValidate():boolean{
    let lo:number=this.editForm.value.longitudeInput;
    let la:number=this.editForm.value.latitudeInput;

    if(lo<this.mapRestriction.latLngBounds['west']||lo>this.mapRestriction.latLngBounds['east']||
    la<this.mapRestriction.latLngBounds['south']||la>this.mapRestriction.latLngBounds['north']){
      return false;
    }
    return true;
  }

  //Az editForm elküldésénél végbemegy a parkolóház szerkesztése.
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
      this.closePopUp2();
    });
    this.parkHouseService.errorOccured.subscribe(errorText => {
      this.error = errorText;
    });

  }

  //Új szektor hozzáadására való űrlap küldése.
  submitSectorAddForm() {
    this.error = null;
    if (this.addForm.valid && this.validateSectorAddSectorForm(this.addForm)) {
      this.addForm.ngSubmit.emit();
    } else {
      this.error='Érvénytelen adatok!';
    }
  }

  //Az új szektor létező emeleten van-e?
  private validateSectorAddSectorForm(form:NgForm): boolean {
    let returnValue = form.value.sectorFloorInput<=this.parkHouse.firstFloor+this.parkHouse.numberOfFloors &&
    form.value.sectorFloorInput>=this.parkHouse.firstFloor;
    return returnValue;
  }

  //Űrlap elüldésekor végbemegy az új szektor hozzáadása.
  onSectorAddSubmit() {
    let sector: Sector = {
      name: this.addForm.value.sectorNameInput,
      floor: this.addForm.value.sectorFloorInput,
      parkingLots: [],
      parkHouse: null
    }
    this.addNewSector(sector);
  }


  //Felugró ablakot bezáró függvényeket felül kell írni, hogy eltüntessük az hiba szöveget.
  closePopUp() {
    this.popUpIsOpen = false;
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
