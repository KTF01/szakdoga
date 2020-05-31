import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ParkHousesComponent } from './components/park-houses/park-houses.component';
import { ParkHouseDetailComponent } from './components/park-house-detail/park-house-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ParkingLotDetailComponent } from './components/parking-lot-detail/parking-lot-detail.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { TimeLogComponent } from './components/time-log/time-log.component';
import { AuthGuard } from './auth-guard';
import { Role } from './models/Role';
import { UserListComponent } from './components/user-list/user-list.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { HeaderNavComponent } from './components/common/header-nav/header-nav.component';
import { FrameComponent } from './components/common/frame/frame.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';

/**
 * Navogáció és útvonal választást lehetővé tevő konfigurációs osztály.
 */

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo:'login',pathMatch: 'full'},
  //AuthGuarddal levédünk bizonyos url-eket, hogy ne érjék el bejelentkezés nélkül.
  {path: 'frame', component:FrameComponent, canActivate:[AuthGuard],children:[
    {path: 'parkHouses', component: ParkHousesComponent},
    {path: 'userDetail', component: UserDetailComponent},
    {path: 'userDetail/:id', component: UserDetailComponent},
    {path: 'parkHouses/parkHouse/:id', component: ParkHouseDetailComponent},
    {path: 'parkHouses/parkHouse/:id/parkingLot/:id', component: ParkingLotDetailComponent},
    {path: 'diary', component: TimeLogComponent,canActivate:[AuthGuard],  data:{permissions:[Role.ROLE_ADMIN, Role.ROLE_FIRST_USER]}},
    {path: 'dataList', component: HeaderNavComponent ,canActivate:[AuthGuard],  data:{permissions:[Role.ROLE_ADMIN, Role.ROLE_FIRST_USER]}, children:[
      {path:'userList', component: UserListComponent},
      {path:'carList', component: CarListComponent},
      {path:'reservationList', component: ReservationListComponent}
    ]},
  ]},
  {path: 'notFound', component: NotFoundComponent},
  {path: '**', redirectTo: 'notFound'},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
