import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ParkHouseService } from '../../services/park-house.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading:boolean = false;

  error:string= null;

  constructor(private router: Router, private parkHouseService: ParkHouseService) { }

  ngOnInit(): void {
  }

  logIn() {
    this.isLoading=true;
    this.parkHouseService.loadParkHouses();
    this.parkHouseService.loadedParkHouses.subscribe(_=>{
      this.router.navigate(['/parkHouses']);
      this.isLoading=false;
    });
    this.parkHouseService.errorOccured.subscribe(errorMessage=>{
      this.isLoading=false;
      this.error=errorMessage;
    });

  }

}
