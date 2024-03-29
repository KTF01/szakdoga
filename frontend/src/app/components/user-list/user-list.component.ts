import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { CommonService } from '../../services/common.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../models/User';
import { Role } from '../../models/Role';
import { Router } from '@angular/router';
import { PopUpContainer } from '../common/pop-up/PopUpContainer';

/**
 * Nyilvántartásoknál megjelenő felhasználók listája.
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],encapsulation: ViewEncapsulation.None
})
export class UserListComponent extends PopUpContainer implements OnInit {

  userIcon =faUser;

  //Enum konstansok hogy a html-templatben tuduk őket használni.
  FIRST_USER_ROLE: Role = Role.ROLE_FIRST_USER;
  USER_ROLE: Role = Role.ROLE_USER;

  nameFilter:string="";

  selectedUser:User;

  constructor(private router:Router,public userService:UserServiceService, public commonService:CommonService) {super(); }

  //Betöltjük inicializációkor a felhasználólkat.
  ngOnInit(): void {
    this.userService.loadUsers();
  }

  //Felhasználóra kattintva átnavigálunk a felhasználó adatit megjelenítő felületre.
  navigateToUserDetail(id:number){
    this.router.navigate(["frame/userDetail/"+id]);
  }

  getUserIcon(user:User){
    return this.userService.getUserIcon(user);
  }

  //A jogosultság kezelésre alkalmas gombok megnyomásának kezalése.
  adminBtnPressed(user:User){
    if(user.role==Role.ROLE_USER){
      console.log(user.firstName +' Admin lett!');
      this.userService.setRole(user, Role.ROLE_ADMIN);
    }else if(user.role==Role.ROLE_ADMIN){
      console.log(user.firstName +' elvesztette adminságát!');
      this.userService.setRole(user, Role.ROLE_USER);
    }else{
      console.log(user.firstName +' az első User, nem módosítható!');
    }
    this.closePopUp();
  }

  //A keresési feltételnek megfelelő lista előállítása
  filteredUserList():User[]{
    if(this.nameFilter===""){
      return this.userService.users;
    }else{
      return this.userService.users.filter(elem=>{
        let text = elem.firstName+" "+elem.lastName+" "+elem.email;
        return text.toLocaleLowerCase().includes(this.nameFilter.toLowerCase()) ;
      });
    }
  }

  openPopUpCustom(user:User){
    this.popUpIsOpen=true;
    this.selectedUser= user;
  }

}
