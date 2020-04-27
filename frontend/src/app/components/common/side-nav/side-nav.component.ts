import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { Role } from '../../../models/Role';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit, OnChanges {

  isAdmin: boolean;
  logedInuserId: number;

  constructor(public authService:AuthService, public router:Router, public commonService:CommonService) { }

  ngOnInit(): void {
    if(this.authService.loggedInUser){
      this.isAdmin = !(this.authService.loggedInUser.role==Role.ROLE_USER);
      this.logedInuserId = this.authService.loggedInUser.id;
    }

  }

  ngOnChanges(){
    console.log('CHANGE');
  }

  navigateToUserDetail(){
    this.router.navigate(['frame/userDetail']);
  }

  navigateToParkHouses(){
    this.router.navigate(['frame/parkHouses']);
  }

  navigatetToDiary(){
    this.router.navigate(['frame/diary']);
  }
  navigatetToUserList(){
    this.router.navigate(['frame/dataList/userList']);
  }

  fireLogout(){
    this.authService.logout();
  }

}