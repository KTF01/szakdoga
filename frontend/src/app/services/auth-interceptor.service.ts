import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService){}
  intercept(request: HttpRequest<any>, next: HttpHandler){
    if(request.url.match(/parkHouses+/)!=null){
      const modifiedRequest: HttpRequest<any> = request.clone({headers: request.headers.append('Authorization', `Basic ${this.authService.authToken}`)});
      return next.handle(modifiedRequest);

    }else{
      return next.handle(request);

    }

  }
}
