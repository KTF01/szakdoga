import { Component, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { ParkHouse } from '../../models/ParkHouse';
import { ParkHouseService } from '../../services/park-house.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PopUpContainer } from '../common/pop-up/PopUpContainer';
import { CommonService } from '../../services/common.service';
import { ListTileComponent } from '../list-tile/list-tile.component';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { MapRestriction, InfoWindow } from '@agm/core/services/google-maps-types';
import { CommonData } from '../../common-data';
/**
 * Parkolóházak és a térkép megjelenítéséért felelős komponens.
 */
@Component({
  selector: 'app-park-houses',
  templateUrl: './park-houses.component.html',
  styleUrls: ['./park-houses.component.css']
})
export class ParkHousesComponent extends PopUpContainer implements OnInit, OnDestroy {

  parkHouses: ParkHouse[];
  formChecked: boolean = false;
  errorText: string = null;
  error: string = null;

  @ViewChild('addPhForm') addParkHouseForm: NgForm;
  @ViewChildren('listTile') tile: QueryList<ListTileComponent>;
  //A térkép jelolőinek listája
  @ViewChildren('phMarkerInfo') windows: QueryList<InfoWindow>;

  //Eseményekre való feliratkozást tároló adattagok.
  errorSub: Subscription = new Subscription();
  closestSub: Subscription = new Subscription();

  closestBtnAllowed:boolean = this.commonService.isLocationAvailable;
  //A térkép korlátainak meghatározása
  mapRestriction: MapRestriction = CommonData.maprRestriction;

  isAddview:boolean = false;
  isAaddMarkerVisible:boolean = false;
  addMarkerLong: number = 0;
  addMarkerLat:number = 0;
  isGetClosestLoading:boolean=false;
  deviceLongitude:number = this.commonService.authLongitude;
  deviceLatitude:number = this.commonService.authLatitude;

  selectedparkHouse: ParkHouse;

  phMarkers: {markerId:number,parkHouse:ParkHouse, longitude: number, latitude: number}[]=[];
  marcerIcon= {
    url: './assets/home-solid.svg',
    scaledSize:{
      width: 20,
      height: 20
    }
  };
  userMarkerIcon = {
    url:'./assets/male-solid.svg',
    scaledSize:{
      width: 15,
      height: 15
    }
  }

  constructor(private parkHouseService: ParkHouseService, private route: ActivatedRoute, private router: Router,
    public commonService: CommonService, private authService: AuthService) { super(); }

    //Inicializációkor lekérdezzük a parkolóházakat a backendtől.
  ngOnInit(): void {
    this.parkHouseService.loadParkHouses();
    this.parkHouseService.loadedParkHouses.subscribe(_ => {
      this.parkHouses = this.parkHouseService.parkHouses;
      for( let ph of this.parkHouses){
        let id = this.phMarkers.length;
        this.phMarkers.push({markerId:id, parkHouse:ph,longitude:ph.longitude,latitude: ph.latitude});
      }
    });
    this.errorSub = this.parkHouseService.errorOccured.subscribe(errorMessage => {
      this.error = errorMessage;
      console.log(this.error);
    });
  }

  //Kijelölt parkolóház meghatározása.
  setSelectedParkHouse(id:number){
    let index = this.parkHouses.findIndex(ph=>ph.id==id);
    this.selectedparkHouse=this.parkHouses[index];
  }

  //Új parkolóház hozzáadásakor eltűnnek a parkolóházak és helyette megjelenik az űrlap.
  changeToAddView(){
    this.isAddview =true;
    this.errorText=null;
  }

  //Űrlap nézet visszaállígtása parkolóházak lista nézetté.
  changeToNormalView(){
    this.isAddview =false;
    this.isAaddMarkerVisible=false;
    this.addParkHouseForm.reset();
    this.formChecked=false;
  }

  //Parkolóház hozzáadása, kiszolgáló hívása.
  addParkHouse(parkHouse: ParkHouse): void {
    this.commonService.isLoading = true;
    this.parkHouseService.addNewParkHouse(parkHouse);
    this.parkHouseService.addedParkHouse.subscribe(newPh => {
      this.commonService.isLoading = false;
      this.isAddview=false;
      this.isAaddMarkerVisible=false;
      let id = this.phMarkers.length;
      this.phMarkers.push({markerId:id,parkHouse: newPh,longitude:newPh.longitude, latitude:newPh.latitude});
    })
    this.parkHouseService.errorOccured.subscribe(error => {
      console.log(error);
      this.errorText = error;
      this.isAaddMarkerVisible=false;
    });
  }

  //Parkolóház tölése.
  deleteParkHouse(parkHouse: ParkHouse, INDEX: number): void {
    this.commonService.isLoading = true;
    this.parkHouseService.removeParkHouse(parkHouse);

    this.parkHouseService.deletedParkHouse.subscribe(deletedId => {
      this.commonService.isLoading = false;
      let index = this.phMarkers.findIndex(marker=>marker.parkHouse.id==deletedId);
      this.phMarkers.splice(index,1);
      this.closePopUp2();
    });
    this.parkHouseService.errorOccured.subscribe(error => {
      this.tile.toArray()[INDEX].errorDisplay = error;
    })
  }

  //Parkolóházra kattintva átnavigálunk a parkolóház részleteire.
  openParkHouseDetail(id:number): void {
    this.router.navigate(['parkHouse', id], { relativeTo: this.route });
  }

  //Parkolóház hozzáadásához szükséges űrlap ellenőrzése.
  onSubmit() {
    this.formChecked = true;
    if (this.addParkHouseForm.valid) {
      if(this.formExtraValidate()){
        let newParkhouse: ParkHouse = {
          name: this.addParkHouseForm.value.parkHouseNameInput,
          address: this.addParkHouseForm.value.parkHouseAddressInput,
          firstFloor: this.addParkHouseForm.value.firstFloorInput,
          numberOfFloors: this.addParkHouseForm.value.numFloorInput,
          sectors: [],
          longitude: this.addParkHouseForm.value.longitudeInput,
          latitude: this.addParkHouseForm.value.latitudeInput,
        }
        this.addParkHouse(newParkhouse);
        this.formChecked = false;
      }else{
        this.errorText="A koordinátáknak Budapesten belül kell lennie! A térképre duplán kattintva kijelölhet pontos helyet.";
      }

    } else {
      this.errorText = "Érvenytelen mezők szerepelnek az űrlapban."
    }
  }

  formExtraValidate():boolean{
    let lo:number=this.addParkHouseForm.value.longitudeInput;
    let la:number=this.addParkHouseForm.value.latitudeInput;

    if(lo<this.mapRestriction.latLngBounds['west']||lo>this.mapRestriction.latLngBounds['east']||
    la<this.mapRestriction.latLngBounds['south']||la>this.mapRestriction.latLngBounds['north']){
      return false;
    }
    return true;
  }

  //Legközelebbi parkolóház lekérdezésének megkezdése. Ha sikerült akkor a megfelelő marker infóablaka felugrik.
  startGettinClosestParkHouse() {
    this.isGetClosestLoading=true;
    this.authService.getClosestParkhouse();
    this.closestSub = this.authService.closestParkHouse.subscribe(id=>{
      this.setSelectedParkHouse(id);
      let marker = this.phMarkers.find(m=>m.parkHouse.id==id);
      for(let i = 0; i< this.windows.toArray().length; i++){
        if(i===marker.markerId){
          this.windows.toArray()[i].open();
        }else {
          this.windows.toArray()[i].close();
        }
      }

      this.closestSub.unsubscribe();
      this.isGetClosestLoading=false;
    });

  }

  //Térképre duplakattintás során megjelenik egy jelölő. Csak akkor ha épp parkolóházat adunk hozzá.
  placeMarker(event) {
    if(this.isAddview){
      let lo: number = +event.coords.lng;
      let la: number = +event.coords.lat;
      this.addParkHouseForm.value.longitudeInput = lo;
      this.addParkHouseForm.value.latitudeInput = la;
      this.addMarkerLat = la;
      this.addMarkerLong = lo;
      this.isAaddMarkerVisible=true;
    }
  }

  closePopup(): void {
    this.formChecked = false;
    this.popUpIsOpen = false;
  }

  //Leiratkozunk az errorSub-ról
  ngOnDestroy() {
    if (this.errorSub) this.errorSub.unsubscribe();
  }
}
