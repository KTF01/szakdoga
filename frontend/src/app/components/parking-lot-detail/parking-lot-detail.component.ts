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

  isUsersView:boolean=true;
  selectedUser:User=null;
  isAdmin:boolean;

  isParkActionShown:boolean;
  @ViewChild('form') editForm: NgForm;

  constructor(private parkingLotService: ParkingLotService, private route:ActivatedRoute,
    private router: Router, public userService:UserServiceService, private authService:AuthService) { super();}

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    this.parkingLot=this.parkingLotService.getParkingLot(id);

    if(this.authService.loggedInUser){
      this.isAdmin = !(this.authService.loggedInUser.role==Role.ROLE_USER);
      this.isUsersView = this.isAdmin;
      if(this.isAdmin){
        this.userService.loadUsers();
        // this.usersSub = this.userService.usersLoaded.subscribe(_=>{

        // });
      }else{
        this.selectedUser=this.authService.loggedInUser;
      }
      if(this.parkingLot.occupiingCar){
        this.isParkActionShown = this.isAdmin || (!this.isAdmin&&this.parkingLot.occupiingCar.owner.id===this.authService.loggedInUser.id)
      }else{
        this.isParkActionShown=true;
      }

    }
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
      this.parkingLot.occupiingCar=null;
    });
  }

  parkIn(car:Car){
    this.parkingLotService.parkIn(this.parkingLot, car);
    this.parkInSub = this.parkingLotService.parkedIn.subscribe(responsePl=>{
      this.parkingLot=responsePl;
      this.closePopUp3();
    });

  }

  onEditSubmit(){
    this.parkingLotService.updateParkingLotName(this.parkingLot, this.editForm.value.newNameInput);
    this.parkingLotService.parkingLotUpdated.subscribe(newName=>{
      this.parkingLot.name=newName;
      this.closePopUp2();
    })
  }

  ngOnDestroy(){
    if(this.parkInSub) this.parkInSub.unsubscribe();
  }
}
