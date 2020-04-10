import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
    PopUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
