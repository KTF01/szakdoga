import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private commonService:CommonService){}
  intercept(request: HttpRequest<any>, next: HttpHandler){
    if(request.url.match(/parkHouses+/)!=null){
      const modifiedRequest: HttpRequest<any> = request.clone({headers: request.headers.append('Authorization', `Basic ${this.commonService.authToken}`)});
      return next.handle(modifiedRequest);

    }else{
      return next.handle(request);

    }

  }
}
