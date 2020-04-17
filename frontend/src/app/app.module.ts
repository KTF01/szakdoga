import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { ParkHousesComponent } from './components/park-houses/park-houses.component';
import { ListTileComponent } from './components/list-tile/list-tile.component';
import { ParkHouseDetailComponent } from './components/park-house-detail/park-house-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ParkingLotListComponent } from './components/parking-lot-list/parking-lot-list.component';
import { AddButtonComponent } from './components/add-button/add-button.component';
import { ParkingLotDetailComponent } from './components/parking-lot-detail/parking-lot-detail.component';
import { PopUpComponent } from './components/pop-up/pop-up.component';
import { LoadingSpinnerComponent } from './components/common/loading-spinner/loading-spinner.component';
import { SideNavComponent } from './components/common/side-nav/side-nav.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ParkHousesComponent,
    ListTileComponent,
    ParkHouseDetailComponent,
    NotFoundComponent,
    ParkingLotListComponent,
    AddButtonComponent,
    ParkingLotDetailComponent,
    PopUpComponent,
    LoadingSpinnerComponent,
    SideNavComponent,
    UserDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
