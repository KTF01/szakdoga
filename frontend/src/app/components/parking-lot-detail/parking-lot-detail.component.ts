import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ParkingLot } from '../../models/ParkingLot';
import { ParkingLotService } from '../../services/parking-lot.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PopUpContainer } from '../pop-up/PopUpContainer';
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

@Component({
  selector: 'app-parking-lot-detail',
  templateUrl: './parking-lot-detail.component.html',
  styleUrls: ['./parking-lot-detail.component.css']
})
export class ParkingLotDetailComponent extends PopUpContainer implements OnInit, OnDestroy {

  parkingLot: ParkingLot;
  editIcon = faEdit;
  trashIcon = faTrash;
  carIcon = faCar;

  parkInSub: Subscription;
  usersSub: Subscription;
  reservSub:Subscription;
  delReservSub:Subscription;

  isUsersView:boolean=true;
  selectedUser:User=null;
  isAdmin:boolean;
  reserveEndTimeString: string = "";
  isReservable:boolean;
  isUsersCar:boolean;

  isParkActionShown:boolean;
  @ViewChild('form') editForm: NgForm;
  @ViewChild('reservForm') resForm: NgForm;

  constructor(private parkingLotService: ParkingLotService, private route:ActivatedRoute,
    private router: Router, public userService:UserServiceService, public authService:AuthService,
    private reservationService:ReservationServiceService) { super();}

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    this.parkingLot=this.parkingLotService.getParkingLot(id);
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

  changeView(user:User){
    this.isUsersView=!this.isUsersView;
    this.selectedUser = user;
  }
  closePopUp3(){
    this.popUp3IsOpen=false;
    this.isUsersView=this.isAdmin;
  }
  deleteParkingLot(){
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

  parkOut(){
    this.parkingLotService.parkOut(this.parkingLot);
    this.parkingLotService.parkedOut.subscribe(_=>{
      this.parkingLot.occupyingCar=null;
      this.setReservationDisplay();
    });
  }

  parkIn(car:Car){
    this.parkingLotService.parkIn(this.parkingLot, car);
    this.parkInSub = this.parkingLotService.parkedIn.subscribe(responsePl=>{
      this.parkingLot=responsePl;
      this.closePopUp3();
      this.setReservationDisplay();
    });

  }

  onEditSubmit(){
    this.parkingLotService.updateParkingLotName(this.parkingLot, this.editForm.value.newNameInput);
    this.parkingLotService.parkingLotUpdated.subscribe(newName=>{
      this.parkingLot.name=newName;
      this.closePopUp2();
    })
  }

  sendReservation(){
    let duration:number = this.resForm.value.durationSelectInput *3600000;
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
    });
  }

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
    });
  }
  ngOnDestroy(){
    if(this.parkInSub) this.parkInSub.unsubscribe();
    if(this.reservSub) this.reservSub.unsubscribe();
    if(this.delReservSub) this.delReservSub.unsubscribe();
  }
}
