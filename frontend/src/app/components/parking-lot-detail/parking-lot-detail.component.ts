import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ParkingLot } from '../../models/ParkingLot';
import { ParkingLotService } from '../../services/parking-lot.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PopUpContainer } from '../common/pop-up/PopUpContainer';
import { faEdit, faTrash, faCar } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { UserServiceService } from '../../services/user-service.service';
import { User } from '../../models/User';
import { Car } from '../../models/Car';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/Role';
import { ReservationServiceService } from '../../services/reservation-service.service';
import { CommonData } from '../../common-data';
import { CommonService } from '../../services/common.service';
import { ParkHouseService } from '../../services/park-house.service';

/**
 * Parkolóhely részleteit megjelenítő komponens.
 */

@Component({
  selector: 'app-parking-lot-detail',
  templateUrl: './parking-lot-detail.component.html',
  styleUrls: ['./parking-lot-detail.component.css']
})
export class ParkingLotDetailComponent extends PopUpContainer implements OnInit, OnDestroy {

  parkingLot: ParkingLot;
  //ikonok
  editIcon = faEdit;
  trashIcon = faTrash;
  carIcon = faCar;

  //Feliratkozások
  parkInSub: Subscription;
  usersSub: Subscription;
  reservSub:Subscription;
  delReservSub:Subscription;
  errorSub: Subscription;

  //Megejelenítést vezérló segédváltozük;
  isUsersView:boolean=true;
  selectedUser:User=null;
  isAdmin:boolean;
  reserveEndTimeString: string = "";
  isReservable:boolean;
  isUsersCar:boolean;
  isParkActionShown:boolean;

  //Hiba információ megjelenítéséhez szükséges változók
  errorText:string = "";
  invalidText:string="";


  @ViewChild('form') editPlForm: NgForm;
  @ViewChild('reservForm') resForm: NgForm;

  constructor(private parkingLotService: ParkingLotService, private route:ActivatedRoute,
    private router: Router, public userService:UserServiceService, public authService:AuthService,
    private reservationService:ReservationServiceService, public commonService:CommonService, private phService:ParkHouseService) { super();}

    /**
     * Inicializáskor történő dolgok:
     * url paraméterből kinyer id alapján parkoló lekérdezése.
     * Megállapítjuk, hogy admin-e a felhasználó
     * Ha admin akkor lekérdezzük a userek listáját, hogy meg tudjuk majd jeleníteni őket a beparkoltatásnál.
     * Eldöntjük, a autó áll bent akkor az a felhasználó autója-e
     */
  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    this.parkingLot=this.phService.getParkingLot(id);
    if(this.authService.loggedInUser){
      this.isAdmin = !(this.authService.loggedInUser.role==Role.ROLE_USER);
      this.isUsersView = this.isAdmin&&!this.parkingLot.isReserved;
      if(this.isAdmin&&!this.parkingLot.isReserved){
        this.userService.loadUsers();
      }else{
        this.selectedUser=this.authService.loggedInUser;
      }
      this.setReservationDisplay();
    }
    if(this.parkingLot.occupyingCar!=null){
      this.isUsersCar = this.parkingLot.occupyingCar.owner.id==this.authService.loggedInUser.id;
    }else{
      this.isUsersCar = false;
    }

  }

  //Ha van foglalás akkor annak megfelelően frissítjük a felületet.
  setReservationDisplay():void{
    this.isParkActionShown = !this.parkingLot.isReserved||(this.parkingLot.isReserved&&this.parkingLot.reservation.user.id==this.authService.loggedInUser.id);
    if(this.parkingLot.occupyingCar){
      this.isParkActionShown = this.isParkActionShown && (this.isAdmin||this.parkingLot.occupyingCar.owner.id==this.authService.loggedInUser.id);
    }
    if(this.parkingLot.isReserved){
      this.reserveEndTimeString = CommonData.convertTimeString(this.parkingLot.reservation.endTime.toString());
    }
    this.isReservable=!this.parkingLot.occupyingCar||
    (this.parkingLot.occupyingCar && (this.parkingLot.occupyingCar.owner.id==this.authService.loggedInUser.id||
      this.isAdmin&&this.parkingLot.isReserved));
  }

  //Beálláskor az autók és a felhasználók listája közötti váltás.
  changeView(user:User){
    this.isUsersView=!this.isUsersView;
    this.selectedUser = user;
  }
  closePopUp3(){
    this.popUp3IsOpen=false;
    this.isUsersView=this.isAdmin;
  }

  //A Parkoló törlése, sikeres törlés esetén visszanavigálunk a parkolóház felületére.
  deleteParkingLot(){
    this.parkingLotService.removeParkingLot(this.parkingLot);
    this.parkingLotService.parkingLotsDeleted.subscribe(_=>{
      this.closePopUp();
      this.router.navigate(['../../'], {relativeTo:this.route});
    });
    this.errorSub = this.parkingLotService.errorOccured.subscribe(error=>{
      this.errorText = error.toString();
    });

  }

  //Parkoló nevének szerkesztésére való űrlap elküldése
  submitEditForm(){
    if(this.editPlForm.valid){
      this.editPlForm.ngSubmit.emit();
      this.invalidText="";
    }else{
      this.invalidText="Ki kell tölteni a mezőt.";
    }
  }

  //Kipsarkolási művelet végrehalytásának elkezdése.
  parkOut(){
    this.parkingLotService.parkOut(this.parkingLot);
    this.parkingLotService.parkedOut.subscribe(_=>{
      this.parkingLot.occupyingCar=null;
      this.setReservationDisplay();
      this.errorText="";
    });
    this.errorSub = this.parkingLotService.errorOccured.subscribe(error=>{
      this.errorText = error.toString();
    });
  }

  //Beparkolási művelet
  parkIn(car:Car){
    this.parkingLotService.parkIn(this.parkingLot, car);
    this.parkInSub = this.parkingLotService.parkedIn.subscribe(responsePl=>{
      this.parkingLot=responsePl;
      this.closePopUp3();
      this.setReservationDisplay();
      this.errorText="";
    });
    this.errorSub = this.parkingLotService.errorOccured.subscribe(error=>{
      this.errorText = error.toString();
    });

  }

  //Parkoló nevének szerkesztésének végrehalytása a service segítségével.
  onEditSubmit(){
    this.parkingLotService.updateParkingLotName(this.parkingLot, this.editPlForm.value.newNameInput);
    this.parkingLotService.parkingLotUpdated.subscribe(newName=>{
      this.parkingLot.name=newName;
      this.closePopUp2();
      this.errorText="";
    });
    this.errorSub = this.parkingLotService.errorOccured.subscribe(error=>{
      this.errorText = error.toString();
    });
  }

  //Parkoló lefogallása.
  sendReservation(){
    let duration:number = this.resForm.value.durationSelectInput *3600000; //Megszorozzuk a számot egy órányi milisecundummal.
    this.reservationService.makeResevation(this.parkingLot, this.authService.loggedInUser.id, duration);
    this.reservSub = this.reservationService.makeReservSub.subscribe(newReservation=>{
      this.parkingLot.reservation=newReservation;
      this.parkingLot.isReserved=  newReservation.parkingLot.isReserved;
      if(!this.parkingLot.occupyingCar){
        this.parkingLot.sector.parkHouse.freePlCount--;
        this.parkingLot.sector.parkHouse.occupiedPlCount++;
      }
      this.closePopUp4();
      this.setReservationDisplay();
      this.errorText="";
    });
    this.errorSub = this.reservationService.errorOccured.subscribe(error=>{
      this.errorText = error.toString();
    });
  }

  //Folgalás feloldása.
  startReservationDelete(){
    this.reservationService.deleteReservation(this.parkingLot.reservation.id);
    this.delReservSub = this.reservationService.deleteReservSub.subscribe(pl=>{
      this.parkingLot.isReserved=pl.isReserved;
      this.parkingLot.reservation=pl.reservation;
      if(!this.parkingLot.occupyingCar){
        this.parkingLot.sector.parkHouse.freePlCount++;
        this.parkingLot.sector.parkHouse.occupiedPlCount--;
      }
      this.closePopUp4();
      this.setReservationDisplay();
      this.errorText="";
    });
    this.errorSub = this.reservationService.errorOccured.subscribe(error=>{
      this.errorText = error.toString();
    });
  }
  //Feliratkozásokról leiratkozunk ha bezáródik az ablak.
  ngOnDestroy(){
    if(this.parkInSub) this.parkInSub.unsubscribe();
    if(this.reservSub) this.reservSub.unsubscribe();
    if(this.delReservSub) this.delReservSub.unsubscribe();
    if(this.errorSub) this.errorSub.unsubscribe();
  }
  openPopUp(){
    this.errorText="";
    this.popUpIsOpen=true;
  }

  openPopUp2(){
    this.errorText="";
    this.popUp2IsOpen=true;
  }
}
