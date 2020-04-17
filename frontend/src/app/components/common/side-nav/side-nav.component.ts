import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit, OnChanges {

  constructor(public authService:AuthService, public router:Router, public commonService:CommonService) { }

  ngOnInit(): void {
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

  fireLogout(){
    this.authService.logout();
  }

}
