import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { faCar, faTrash,faUser, faUserEdit, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { Car } from '../../models/Car';
import { CommonService } from '../../services/common.service';
import { PopUpContainer } from '../common/pop-up/PopUpContainer';
import { ParkingLotService } from '../../services/parking-lot.service';
import { Subscription, from } from 'rxjs';
import { UserServiceService } from '../../services/user-service.service';
import { User } from '../../models/User';
import { ActivatedRoute } from '@angular/router';
import { Role } from '../../models/Role';
import { NgForm } from '@angular/forms';
import { CommonData } from '../../common-data';
import { Reservation } from '../../models/Reservation';
import { ReservationServiceService } from '../../services/reservation-service.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent extends PopUpContainer implements OnInit, OnDestroy{

  faCar = faCar;
  deleteIson = faTrash;

  selectedCar:Car = null;
  selectedReservation:Reservation = null;

  parkOutSub:Subscription = null;
  carAddSub:Subscription=null;
  carRemoveSub:Subscription=null;
  passwordChangeSub:Subscription=null;
  userRefreshedSub:Subscription=null;
  errorSub:Subscription = null;
  deleteResSub:Subscription = null;

  displayedUser: User;
  loggedInUserFirstUser:boolean = false;
  isLoggedInUser : boolean = true;
  sameuser:boolean;
  error:string = "";

  isCarView:boolean =true;


  constructor(public authService:AuthService, public commonService:CommonService, private parkingLotService:ParkingLotService,
    public userService:UserServiceService, private route:ActivatedRoute, private reservationService:ReservationServiceService) {super(); }

  ngOnInit(): void {
    let userId:number = +this.route.snapshot.params['id'];
    if(userId){
      this.sameuser=userId===this.authService.loggedInUser.id;
      this.authService.refreshLoggedInUserData();
      this.displayedUser = this.userService.getById(userId);
    }
    else{
        this.sameuser=true;
        this.authService.refreshLoggedInUserData();
        this.displayedUser=this.authService.loggedInUser;
        this.userRefreshedSub = this.authService.refreshedLoggedInUser.subscribe(_=>{
          this.displayedUser=_;
          this.userRefreshedSub.unsubscribe();
        });

    }
    this.isLoggedInUser = this.authService.loggedInUser.id== this.displayedUser.id;
    this.loggedInUserFirstUser = this.authService.loggedInUser.role==Role.ROLE_FIRST_USER

  }

  setViewReservs(){
    this.isCarView=false;
  }

  printTime(res:Reservation):string{
    return CommonData.convertTimeString(res.endTime.toString());
  }

  setViewCars(){
    this.isCarView=true;
  }

  parkOut(){
    this.parkingLotService.parkOut(this.selectedCar.occupiedParkingLot);
    this.parkOutSub = this.parkingLotService.parkedOut.subscribe(responseParkingLot=>{
      this.selectedCar.occupiedParkingLot=null;
      this.closePopUp();
    });
    this.errorSub = this.parkingLotService.errorOccured.subscribe(error=>{
      this.error=error;
      this.errorSub.unsubscribe();
    })
  }



  addNewCar(plateNumbInput){//UNSUBSCRIBE
    if(plateNumbInput.valid){
      let newCar:Car= {plateNumber: plateNumbInput.value}
      this.userService.addCarToUser(this.displayedUser,newCar);
      this.carAddSub = this.userService.carAdded.subscribe(responseCar=>{
        //this.displayedUser.ownedCars.push(responseCar);
        this.closePopUp2();
      });
      this.errorSub = this.userService.errorOccured.subscribe(error=>{
        this.error=error;
        this.errorSub.unsubscribe();
      })
    }
  }

  removeCar(car:Car){
    this.userService.deleteCar(car);
    this.carRemoveSub = this.userService.carRemoved.subscribe(newCarList=>{
      console.log(newCarList);
      this.displayedUser.ownedCars=newCarList;
      this.selectedCar=null;
      this.closePopUp3();
    });
    this.errorSub = this.userService.errorOccured.subscribe(error=>{
      this.error=error;
      this.errorSub.unsubscribe();
    })
  }

  passFirstUser(){
    this.userService.setRole(this.displayedUser, Role.ROLE_FIRST_USER);
    this.userService.roleSet.subscribe(_=>{
      this.authService.loggedInUser.role=Role.ROLE_ADMIN;
      this.loggedInUserFirstUser = false;
      this.closePopUp4();
    });
    this.errorSub = this.parkingLotService.errorOccured.subscribe(error=>{
      this.error=error;
      this.errorSub.unsubscribe();
    })
  }

  newPasswordSubmit(form:NgForm){
    if(form.valid){
      if(form.value.newPasswordInput===form.value.newPasswordConfirmInput){
        form.ngSubmit.emit();
        this.error="";
      }else{
        this.error="Az új jelszavak nem egyeznek!";
      }

    }else{
      this.error = "Mindent ki kell tölteni!";
    }
  }

  onPasswordFormSubmit(form:NgForm){
    this.authService.changePassword(form.value.oldPasswordInput,form.value.newPasswordInput);
    this.passwordChangeSub = this.authService.changedPassword.subscribe(_=>{
      this.closePopUp5();
    });
    this.errorSub= this.authService.errorOccured.subscribe(errorMsg=>{
      this.error=errorMsg;
      this.errorSub.unsubscribe();
    });
  }

  selectReservationOpenPopup(res:Reservation){
    this.selectedReservation = res;
    this.openPopUp();
  }

  deleteReservation(){
    this.reservationService.deleteReservation(this.selectedReservation.id);
    this.deleteResSub = this.reservationService.deleteReservSub.subscribe(pl=>{
      let index:number = this.displayedUser.reservations.findIndex(res=>res.id==this.selectedReservation.id);
      this.displayedUser.reservations.splice(index,1);
      this.closePopUp();
    });
    this.errorSub = this.reservationService.errorOccured.subscribe(error=>{
      this.error=error;
      this.errorSub.unsubscribe();
    })
  }

  ngOnDestroy(){
    if(this.parkOutSub) this.parkOutSub.unsubscribe();
    //if(this.errorSub) this.errorSub.unsubscribe();
    if(this.carAddSub) this.carAddSub.unsubscribe();
    if(this.carRemoveSub) this.carRemoveSub.unsubscribe();
    if(this.passwordChangeSub) this.passwordChangeSub.unsubscribe();
    if(this.deleteResSub) this.deleteResSub.unsubscribe();
  }

  openPopUp2(){
    this.popUp2IsOpen=true;
    this.selectedCar=null;
    this.error=null;
  }
  openPopUp3(){
    this.popUp3IsOpen=true;
    this.error=null;
  }
  openPopUp(){
    this.popupIsOpen=true;
    this.error=null;
  }
  openPopUp4(){
    this.popUp4IsOpen =true;
    this.error=null
  }
}
