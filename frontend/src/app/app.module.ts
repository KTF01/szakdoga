import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { ParkHousesComponent } from './components/park-houses/park-houses.component';
import { ListTileComponent } from './components/list-tile/list-tile.component';
import { ParkHouseDetailComponent } from './components/park-house-detail/park-house-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ParkingLotListComponent } from './components/parking-lot-list/parking-lot-list.component';
import { AddButtonComponent } from './components/common/add-button/add-button.component';
import { ParkingLotDetailComponent } from './components/parking-lot-detail/parking-lot-detail.component';
import { PopUpComponent } from './components/common/pop-up/pop-up.component';
import { LoadingSpinnerComponent } from './components/common/loading-spinner/loading-spinner.component';
import { SideNavComponent } from './components/common/side-nav/side-nav.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { TimeLogComponent } from './components/time-log/time-log.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { HeaderNavComponent } from './components/common/header-nav/header-nav.component';
import { FrameComponent } from './components/common/frame/frame.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ChartsModule } from 'ng2-charts';
import { PieChartComponent } from './components/common/pie-chart/pie-chart.component';
import { LineChartComponent } from './components/common/line-chart/line-chart.component';

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
    UserDetailComponent,
    TimeLogComponent,
    UserListComponent,
    CarListComponent,
    HeaderNavComponent,
    FrameComponent,
    ReservationListComponent,
    PieChartComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC5Ps-M1wtosWKu1A_GsR1uOWUdQn3p5sI'
    }),
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
