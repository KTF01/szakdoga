import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ParkHousesComponent } from './components/park-houses/park-houses.component';
import { ParkHouseDetailComponent } from './components/park-house-detail/park-house-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ParkingLotDetailComponent } from './components/parking-lot-detail/parking-lot-detail.component';
import { SideNavComponent } from './components/common/side-nav/side-nav.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { TimeLogComponent } from './components/time-log/time-log.component';
import { AuthGuard } from './auth-guard';
import { Role } from './models/Role';
import { UserListComponent } from './components/user-list/user-list.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { HeaderNavComponent } from './components/common/header-nav/header-nav.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo:'login',pathMatch: 'full'},
  {path: 'frame', component:SideNavComponent, canActivate:[AuthGuard],children:[
    {path: 'parkHouses', component: ParkHousesComponent},
    {path: 'userDetail', component: UserDetailComponent},
    {path: 'userDetail/:id', component: UserDetailComponent},
    {path: 'parkHouses/parkHouse/:id', component: ParkHouseDetailComponent},
    {path: 'parkHouses/parkHouse/:id/parkingLot/:id', component: ParkingLotDetailComponent},
    {path: 'diary', component: TimeLogComponent,canActivate:[AuthGuard],  data:{permissions:[Role.ROLE_ADMIN, Role.ROLE_FIRST_USER]}},
    {path: 'dataList', component: HeaderNavComponent ,canActivate:[AuthGuard],  data:{permissions:[Role.ROLE_ADMIN, Role.ROLE_FIRST_USER]}, children:[
      {path:'userList', component: UserListComponent},
      {path:'carList', component: CarListComponent}
    ]},
  ]},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
