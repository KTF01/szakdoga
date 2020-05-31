import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { Subscription } from 'rxjs';
import { UserServiceService } from '../../services/user-service.service';
import { CommonData } from '../../common-data';

/**
 * A bejelentkezésért felelős felület.
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  //Ha hiba van ebbe a változóba kerül az üzenet.
  error:string= null;
  title:string = CommonData.title;
  isLoginMode: boolean=true;

  //A komponens html template-jéből hivatkozott form elem.
  @ViewChild('authForm') authForm:NgForm;

  private logInSub: Subscription;


  constructor(private router: Router, public commonService: CommonService, private authService:AuthService, private userService:UserServiceService) { }

  ngOnInit(): void {
    if(this.userService.users!=null)this.userService.users = null;
  }

  //Bejelentkező és regisztrációs nézet közötti váltás
  switchMode(){
    this.isLoginMode=!this.isLoginMode;
    this.authForm.reset();
    this.error=null;
  }

  //A kiszolgálót hívva végbemegy a bejelentkezés. Ha sikerült átnavigálunk a parkolóházakhoz.
  logIn() {
    this.authService.login(this.authForm.value.emailInput, this.authForm.value.passwordInput);
    this.authService.errorOccured.subscribe(errorMessage=>{
      if(errorMessage)
      this.error=errorMessage;
    });
    this.logInSub= this.authService.loggedIn.subscribe(_=>{
      this.router.navigate(['frame/parkHouses']);
    });
  }

  //Regisztráció, ha sikeres átváltunk bejeéentkező nézetre.
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

  //A form tartalmának feldolgozása és ha valid akkor bejelentkezés (vagy regisztrálás)
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
      this.error="Töltsön ki minden mezőt helyesen!"
    }
  }

  //A jelszó megerősítés helyességének ellenőrzése
  passwordMatches():boolean{
    return this.authForm.value.passwordInput===this.authForm.value.passwordConfirmInput;
  }

  //A komponens megsemmisülésekor leiratkozunk a feliratkozsokról.
  ngOnDestroy(){
    this.logInSub.unsubscribe();
  }
}
