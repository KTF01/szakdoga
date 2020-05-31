import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { faCar, faTrash} from '@fortawesome/free-solid-svg-icons';
import { Car } from '../../models/Car';
import { CommonService } from '../../services/common.service';
import { PopUpContainer } from '../common/pop-up/PopUpContainer';
import { ParkingLotService } from '../../services/parking-lot.service';
import { Subscription } from 'rxjs';
import { UserServiceService } from '../../services/user-service.service';
import { User } from '../../models/User';
import { ActivatedRoute, Router } from '@angular/router';
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

  //Ikonok
  faCar = faCar;
  deleteIcon = faTrash;

  selectedCar:Car = null;
  selectedReservation:Reservation = null;

  //Feliratokozások
  parkOutSub:Subscription = null;
  carAddSub:Subscription=null;
  carRemoveSub:Subscription=null;
  passwordChangeSub:Subscription=null;
  userRefreshedSub:Subscription=null;
  errorSub:Subscription = null;
  deleteResSub:Subscription = null;

  //Megjalenítéshez használt segéd változók.
  displayedUser: User;
  loggedInUserFirstUser:boolean = false;
  isDisplayedUserFirstUser:boolean = false;
  isLoggedInUser : boolean = true;
  sameuser:boolean;
  error:string = "";
  addCarFormChecked: boolean=false;
  isCarView:boolean =true;


  constructor(public authService:AuthService, public commonService:CommonService, private parkingLotService:ParkingLotService,
    public userService:UserServiceService, private route:ActivatedRoute, private reservationService:ReservationServiceService,
    private router:Router) {super(); }

  ngOnInit(): void {
    let userId:number = +this.route.snapshot.params['id'];
    this.authService.refreshLoggedInUserData();
    if(userId){
      this.sameuser=userId===this.authService.loggedInUser.id;
      this.displayedUser = this.userService.getById(userId);
    }
    else{
        this.sameuser=true;
        this.displayedUser=this.authService.loggedInUser;
        this.userRefreshedSub = this.authService.refreshedLoggedInUser.subscribe(_=>{
          this.displayedUser=_;
          this.userRefreshedSub.unsubscribe();
        });

    }
    //Meghatározzuk hogy a felület a bejelentkezett usert mutatja-e (Nem a nyilvántartásból jöttünk-e át msá felhasználót vizsgálva.)
    this.isLoggedInUser = this.authService.loggedInUser.id== this.displayedUser.id;
    //A bejelentkezett felhasználó admin-e
    this.loggedInUserFirstUser = this.authService.loggedInUser.role==Role.ROLE_FIRST_USER;
    //A felhasználó akit mutat a felület az első felhasználó-e.
    this.isDisplayedUserFirstUser = this.displayedUser.role==Role.ROLE_FIRST_USER;

  }

  //Átváltunk a foglalások listájára
  setViewReservs(){
    this.isCarView=false;
  }

  printTime(res:Reservation):string{
    return CommonData.convertTimeString(res.endTime.toString());
  }

  //átváltunk az autók listájára
  setViewCars(){
    this.isCarView=true;
  }

  //Kiparkolás
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

  //Új autó felvétele
  addNewCar(plateNumbInput){
    this.addCarFormChecked = true;
    if(plateNumbInput.valid){
      let newCar:Car= {plateNumber: plateNumbInput.value}
      this.userService.addCarToUser(this.displayedUser,newCar);
      this.carAddSub = this.userService.carAdded.subscribe(responseCar=>{
        this.closePopUp2();
      });
      this.errorSub = this.userService.errorOccured.subscribe(error=>{
        this.error=error;
        this.errorSub.unsubscribe();
      })
    }
  }

  //Auót törlése
  removeCar(car:Car){
    this.userService.deleteCar(car);
    this.carRemoveSub = this.userService.carRemoved.subscribe(newCarList=>{
      this.displayedUser.ownedCars=newCarList;
      this.selectedCar=null;
      this.closePopUp3();
    });
    this.errorSub = this.userService.errorOccured.subscribe(error=>{
      this.error=error;
      this.errorSub.unsubscribe();
    })
  }

  //Első admin titulus átruházása a displayedUserre
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

  //Jelszó módosítása űrlap validálása
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

  //Jelszó módosító űrlap elküldése
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

  //Megnyitjuk a kiválasztott foglalás rákérdező popupját
  selectReservationOpenPopup(res:Reservation){
    this.selectedReservation = res;
    this.openPopUp();
  }

  //Foglalás kitörlése
  deleteReservation(){
    this.reservationService.deleteReservation(this.selectedReservation.id);
    this.deleteResSub = this.reservationService.deleteReservSub.subscribe(pl=>{
      //A felületen is kitöröljük a foglalást.
      let index:number = this.displayedUser.reservations.findIndex(res=>res.id==this.selectedReservation.id);
      this.displayedUser.reservations.splice(index,1);
      this.closePopUp();
    });
    this.errorSub = this.reservationService.errorOccured.subscribe(error=>{
      this.error=error;
      this.errorSub.unsubscribe();
    })
  }

  //Felhasználó eltávolítása
  deleteUser(user:User){
    this.userService.deleteUser(user);
    this.userService.userDeleted.subscribe(()=>{
      //Sikeres eltávolítás után elnavigálunk a nyilvántartásokhoz
      this.router.navigate(["/frame/dataList/userList"]);
    });
    this.errorSub = this.userService.errorOccured.subscribe(error=>{
      this.error = error;
      this.errorSub.unsubscribe();
    });
  }

  //Komponenes megszünésekkor leiratkozunk a feliratkozásokról
  ngOnDestroy(){
    if(this.parkOutSub) this.parkOutSub.unsubscribe();
    if(this.carAddSub) this.carAddSub.unsubscribe();
    if(this.carRemoveSub) this.carRemoveSub.unsubscribe();
    if(this.passwordChangeSub) this.passwordChangeSub.unsubscribe();
    if(this.deleteResSub) this.deleteResSub.unsubscribe();
  }

  openPopUp2(){
    this.popUp2IsOpen=true;
    this.selectedCar=null;
    this.error=null;
    this.addCarFormChecked = false;
  }
  openPopUp3(){
    this.popUp3IsOpen=true;
    this.error=null;
  }
  openPopUp(){
    this.popUpIsOpen=true;
    this.error=null;
  }
  openPopUp4(){
    this.popUp4IsOpen =true;
    this.error=null
  }
}
