import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ParkHouseService } from '../../services/park-house.service';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error:string= null;

  isLoginMode: boolean=true;

  @ViewChild('authForm') authForm:NgForm;


  constructor(private router: Router, private parkHouseService: ParkHouseService, public commonService: CommonService, private authService:AuthService) { }

  ngOnInit(): void {
  }

  switchMode(){
    this.isLoginMode=!this.isLoginMode;
    this.authForm.reset();
    this.error=null;
  }

  logIn() {

    this.authService.login(this.authForm.value.emailInput, this.authForm.value.passwordInput);
    this.authService.errorOccured.subscribe(errorMessage=>{
      this.error=errorMessage;
    });
    this.authService.loggedIn.subscribe(_=>{
      this.parkHouseService.loadParkHouses();
      this.parkHouseService.loadedParkHouses.subscribe(_=>{
        this.router.navigate(['frame/parkHouses']);
      });
      this.parkHouseService.errorOccured.subscribe(errorMessage=>{
        this.error=errorMessage;
      });
    });
  }

  signUp(){

    let newUser:User={
      firstName: this.authForm.value.firstNameInput,
      lastName: this.authForm.value.lastNameInput,
      email: this.authForm.value.emailInput,
      password: this.authForm.value.passwordInput
    }
    this.authService.signup(newUser);
    this.authService.signUpSubject.subscribe(_=>{
      this.isLoginMode=true;
    });
    this.authService.errorOccured.subscribe(error=>{
      this.error=error;
    });
  }

  onSubmit(){
    console.log(this.authForm);
    if(this.authForm.valid){
      if(this.isLoginMode){
        this.logIn();
        this.error=null;
      }else{
        if(this.passwordMatches()){
          this.signUp();
          this.error=null;
        }else{
          this.error="A jelszavak nem egyeznek";
        }
      }
    }else{
      console.log("Invalid!");
      this.error="Hibák vannak az űrlapban"
    }
  }

  passwordMatches():boolean{
    return this.authForm.value.passwordInput===this.authForm.value.passwordConfirmInput;
  }

}
