import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { faCar, faTrash,faUser, faUserEdit, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { Car } from '../../models/Car';
import { CommonService } from '../../services/common.service';
import { PopUpContainer } from '../pop-up/PopUpContainer';
import { ParkingLotService } from '../../services/parking-lot.service';
import { Subscription, from } from 'rxjs';
import { UserServiceService } from '../../services/user-service.service';
import { User } from '../../models/User';
import { ActivatedRoute } from '@angular/router';
import { Role } from '../../models/Role';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent extends PopUpContainer implements OnInit, OnDestroy{

  faCar = faCar;
  deleteIson = faTrash;

  selectedCar:Car = null;

  parkOutSub:Subscription = null;
  carAddSub:Subscription=null;
  carRemoveSub:Subscription=null;
  passwordChangeSub:Subscription=null;
  errorSub:Subscription = null;

  displayedUser: User;
  loggedInUserFirstUser:boolean = false;
  sameuser:boolean;
  error:string = "";

  constructor(public authService:AuthService, public commonService:CommonService, private parkingLotService:ParkingLotService,
    public userService:UserServiceService, private route:ActivatedRoute) {super(); }

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
    }
    this.loggedInUserFirstUser = this.authService.loggedInUser.role==Role.ROLE_FIRST_USER

  }

  parkOut(){
    this.parkingLotService.parkOut(this.selectedCar.occupiedParkingLot);
    this.parkOutSub = this.parkingLotService.parkedOut.subscribe(responseParkingLot=>{
      this.selectedCar.occupiedParkingLot=null;
      this.closePopUp();
    });
    this.errorSub = this.parkingLotService.errorOccured.subscribe(error=>{
      console.log(error)
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
  }

  passFirstUser(){
    this.userService.setRole(this.displayedUser, Role.ROLE_FIRST_USER);
    this.userService.roleSet.subscribe(_=>{
      this.authService.loggedInUser.role=Role.ROLE_ADMIN;
      this.loggedInUserFirstUser = false;
      this.closePopUp4();
    });
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
    });
  }

  ngOnDestroy(){
    if(this.parkOutSub) this.parkOutSub.unsubscribe();
    if(this.errorSub) this.errorSub.unsubscribe();
    if(this.carAddSub) this.carAddSub.unsubscribe();
    if(this.carRemoveSub) this.carRemoveSub.unsubscribe();
    if(this.errorSub) this.errorSub.unsubscribe();
    if(this.passwordChangeSub) this.passwordChangeSub.unsubscribe();
  }

  openPopUp2(){
    this.popUp2IsOpen=true;
    this.selectedCar=null;
  }
}
