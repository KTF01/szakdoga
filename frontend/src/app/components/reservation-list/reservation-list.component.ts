import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { Reservation } from '../../models/Reservation';
import { CommonData } from '../../common-data';
import { PopUpContainer } from '../common/pop-up/PopUpContainer';
import { ReservationServiceService } from '../../services/reservation-service.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Foglalások listáját megjelenítő komponens (A Nyilvántartás menüpont alattt)
 */

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent extends PopUpContainer implements OnInit, OnDestroy {

  //Keresési szöveg
  filter:string="";
  selectedRervation:Reservation;
  deleteResSub:Subscription;

  constructor(public userService:UserServiceService, private reservatioService:ReservationServiceService,
    private router:Router) {super(); }

  ngOnInit(): void {
  }

  //A filter változóra szűrt foglalások loistáját adja vissza.
  filteredReservationList():Reservation[]{
    if(this.filter===""){
      return this.userService.reservations;
    }else{
      return this.userService.reservations.filter(elem=>{
        let text = elem.user.firstName+elem.user.lastName+elem.parkingLot.sector.parkHouse.name+elem.parkingLot.sector.name+elem.parkingLot.name;
        return text.toLocaleLowerCase().includes(this.filter.toLowerCase()) ;
      });
    }
  }

  //Ha rákattintunk egy foglalás listelemére, átnavigálunk a parkolóhely oldalára.
  navigateToParkinglotDetail(id:number, phId:number){
    this.router.navigate(["frame/parkHouses/parkHouse/"+phId+"/parkingLot/"+id]);
  }

  //Foglalás törlése.
  deleteReservation(){

    this.reservatioService.deleteReservation(this.selectedRervation.id);
    this.deleteResSub = this.reservatioService.deleteReservSub.subscribe(pl=>{
      let index= this.userService.reservations.findIndex(res=>res.id==this.selectedRervation.id);
      this.userService.reservations.splice(index,1);
      this.closePopUp();
    });

  }

  printTime(res:Reservation):string{
    return CommonData.convertTimeString(res.endTime.toString());
  }

  openPopupSelected(res:Reservation){
    this.popUpIsOpen=true;
    this.selectedRervation=res;
  }

  ngOnDestroy(){
    if(this.deleteResSub) this.deleteResSub.unsubscribe();
  }
}
