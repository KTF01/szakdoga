import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService){}
  intercept(request: HttpRequest<any>, next: HttpHandler){
    console.log('Request küldés! '+ request.url);
    console.log(request.headers);
    if(request.url.match(/parkHouses+/)==null){
      return next.handle(request);
    }else{
      const modifiedRequest: HttpRequest<any> = request.clone({headers: request.headers.append('Authorization', `Basic ${this.authService.authToken}`)});
      return next.handle(modifiedRequest);

    }

  }
}
