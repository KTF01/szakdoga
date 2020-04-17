import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ParkHousesComponent } from './components/park-houses/park-houses.component';
import { ParkHouseDetailComponent } from './components/park-house-detail/park-house-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ParkingLotDetailComponent } from './components/parking-lot-detail/parking-lot-detail.component';
import { SideNavComponent } from './components/common/side-nav/side-nav.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo:'login',pathMatch: 'full'},
  {path: 'frame', component:SideNavComponent, children:[
    {path: 'parkHouses', component: ParkHousesComponent},
    {path: 'userDetail', component: UserDetailComponent},
    {path: 'parkHouses/parkHouse/:id', component: ParkHouseDetailComponent},
    {path: 'parkHouses/parkHouse/:id/parkingLot/:id', component: ParkingLotDetailComponent},
  ]},

  {path: 'notFound', component: NotFoundComponent},
  {path: '**', redirectTo: 'notFound'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
