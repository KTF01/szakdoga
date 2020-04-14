import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit, OnChanges {

  constructor(public authService:AuthService, public router:Router) { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    console.log('CHANGE');
  }

  fireLogout(){
    this.authService.logout();
  }

}
