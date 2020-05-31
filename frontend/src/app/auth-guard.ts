
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Role } from './models/Role';

/**
 * AuthGuard-al védjük le az url-eket.
 */

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService, private router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean | UrlTree {
    let isAuthorized:boolean = true;
    if(route.data.permissions&&this.authService.loggedInUser.role===Role.ROLE_USER){
      isAuthorized=false;
    }
    const isAuth:boolean = this.authService.loggedInUser!=null;
    if(isAuth){
      if(isAuthorized){
        return true;
      }else{
        //Ha nincs engedélye nem engedjük a felületre.
        console.log("NO PERMISSION");
        return false;
      }
    }else{
      //Ha nincs autentikálva átnavigálunk a bejelentkezéshez.
      return this.router.createUrlTree(["/login"]);
    }
  }
}
