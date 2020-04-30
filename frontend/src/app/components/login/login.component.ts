import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { Subscription } from 'rxjs';
import { UserServiceService } from '../../services/user-service.service';
import { CommonData } from '../../common-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  error:string= null;
  title:string = CommonData.title;
  isLoginMode: boolean=true;

  @ViewChild('authForm') authForm:NgForm;

  private logInSub: Subscription;


  constructor(private router: Router, public commonService: CommonService, private authService:AuthService, private userService:UserServiceService) { }

  ngOnInit(): void {
    if(this.userService.users!=null)this.userService.users = null;
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
    this.logInSub= this.authService.loggedIn.subscribe(_=>{
      this.router.navigate(['frame/parkHouses']);
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

  ngOnDestroy(){
    this.logInSub.unsubscribe();
  }
}
