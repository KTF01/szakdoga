import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ParkHousesComponent } from './components/park-houses/park-houses.component';
import { ParkHouseDetailComponent } from './components/park-house-detail/park-house-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ParkingLotDetailComponent } from './components/parking-lot-detail/parking-lot-detail.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'parkHouses', component: ParkHousesComponent},
  {path: 'parkHouses/parkHouse/:id', component: ParkHouseDetailComponent},
  {path: 'parkHouses/parkHouse/:id/parkingLot/:id', component: ParkingLotDetailComponent},
  {path: 'notFound', component: NotFoundComponent},
  {path: '**', redirectTo: 'notFound'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }