import { Injectable, ErrorHandler } from '@angular/core';
import { ParkHouse } from '../models/ParkHouse';
import { Sector } from '../models/Sector';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CommonData } from '../common-data';
import { Subject } from 'rxjs';
import { CommonService } from './common.service';
import { SectorService } from './sector.service';
import { ParkingLot } from '../models/ParkingLot';
import { Car } from '../models/Car';
import { Reservation } from '../models/Reservation';
import { Router } from '@angular/router';

/**
 * Parkolóházakkal kapcsolatos műveleteket tartalmazó kiszolgáló osztály.
 */

@Injectable({
  //Az AppModule-ból elérhető és singleton lesz.
  providedIn: 'root'
})
export class ParkHouseService {

  //Események emittálására szolgáló adattagok
  loadedParkHouses: Subject<boolean> = new Subject<boolean>();
  deletedParkHouse: Subject<number> = new Subject<number>();
  addedParkHouse: Subject<ParkHouse> = new Subject<ParkHouse>();
  updatedParkHouse: Subject<ParkHouse> = new Subject<ParkHouse>();
  addedSectorToParkHouse: Subject<ParkHouse> = new Subject<ParkHouse>();
  removedSectorToParkHouse: Subject<boolean> = new Subject<boolean>();
  errorOccured: Subject<string> = new Subject<string>();

  //A parkolóházak listája kezdetben üres
  parkHouses: ParkHouse[] = [
  ]

  constructor(private http: HttpClient, private commonService: CommonService, private sectorService: SectorService, private router: Router) {
  }

  /**
   * Parkolóházak és minden hozzá kapcsolódó adat lekérdezése az alkalmazásszervertől.
   */
  loadParkHouses(): void {
    this.commonService.isLoading = true;
    //válaszban jönnek a parkolóházak, a bennük található autók és foglalások.
    this.http.get<{ parkHouses: ParkHouse[], cars: Car[], reservations: Reservation[] }>(CommonData.hostUri + 'auth/parkHouses/all', {
      headers: new HttpHeaders({ 'Authorization': `Basic ${this.commonService.authToken}` })
    }).subscribe(
      response => {
        this.parkHouses = response.parkHouses;
        for (let ph of this.parkHouses) {
          this.adjustSectors(ph);
          for (let sector of ph.sectors) {
            //Beállítjuk a külön jövő autók és foglalásokat, hogy egymásra referáljanak.
            this.sectorService.adjustParkingLotsWithCarsAndReservations(sector, response.cars, response.reservations);
          }
        }
        this.commonService.isLoading = false;
        this.loadedParkHouses.next(true);
        console.log(this.parkHouses);
      }, error => {
        if (error.status == 0) {
          //0-ás hibánál visszanavigálunk a bejelentkező felületre.
          this.router.navigate(["/login"]);
          this.commonService.isLoading=false;
        } else {
          this.handleError(error);
        }
      }
    );
  }

  //A Json parsolás nem állítja be autómatikusan a szektorok parkházát. Ezért megtesszük mi.
  adjustSectors(parkHouse: ParkHouse) {
    for (let sector of parkHouse.sectors) {
      sector.parkHouse = parkHouse;
    }
  }

  //Parkolóház eltávolítása delete kéréssel.
  removeParkHouse(parkHouse: ParkHouse) {
    this.commonService.isLoading = true;
    this.http.delete<number>(CommonData.hostUri + 'auth/parkHouses/delete/' + parkHouse.id, {
      headers: new HttpHeaders({ 'Authorization': `Basic ${this.commonService.authToken}` })
    }).subscribe(response => {
      this.commonService.isLoading = false;
      console.log(response);
      let index = this.parkHouses.indexOf(parkHouse);
      this.parkHouses.splice(index, 1);
      this.deletedParkHouse.next(response);
    }, error => this.handleError(error));

  }

  //Parkolóház hozzáadása.
  addNewParkHouse(newParkHouse: ParkHouse) {
    this.commonService.isLoading = true;
    this.http.post<ParkHouse>(CommonData.hostUri + 'auth/parkHouses/newPH', newParkHouse, {
      headers: new HttpHeaders({ 'Authorization': `Basic ${this.commonService.authToken}` })
    }).subscribe(response => {
      this.commonService.isLoading = false;
      this.parkHouses.push(response);
      this.addedParkHouse.next(response);
    }, error => this.handleError(error));

  }

  //Parkolóház szerkesztése put kéréssel
  updateParkHouse(parkHouse: ParkHouse): void {
    this.commonService.isLoading = true;
    let index = this.parkHouses.findIndex(ph => ph.id === parkHouse.id);
    this.http.put<ParkHouse>(CommonData.hostUri + 'auth/parkHouses/updatePH/' + parkHouse.id, {
      name: parkHouse.name,
      address: parkHouse.address,
      numberOfFloors: parkHouse.numberOfFloors,
      longitude: parkHouse.longitude,
      latitude: parkHouse.latitude
    }, {
      headers: new HttpHeaders({ 'Authorization': `Basic ${this.commonService.authToken}` })
    }).subscribe(response => {
      this.commonService.isLoading = false;
      this.parkHouses[index].name = response.name;
      this.parkHouses[index].address = response.address;
      this.parkHouses[index].numberOfFloors = response.numberOfFloors;
      this.parkHouses[index].longitude = response.longitude;
      this.parkHouses[index].latitude = response.latitude;
      this.updatedParkHouse.next(response);
    }, error => this.handleError(error));
  }

  getParkHouse(id: number): ParkHouse {
    return this.parkHouses.find(ph => ph.id === id);
  }

  //Szektor hozzáadása parkolóházhoz put kéréssel.
  addSectors(parkHouse: ParkHouse, newSector: Sector): void {

    let index = this.parkHouses.findIndex(ph => ph.id === parkHouse.id);
    this.commonService.isLoading = true;
    this.http.put<ParkHouse>(CommonData.hostUri + 'auth/parkHouses/addSectors/' + parkHouse.id, [newSector], {
      headers: new HttpHeaders({ 'Authorization': `Basic ${this.commonService.authToken}` })
    }).subscribe(response => {
      this.adjustSectors(response);
      this.commonService.isLoading = false;
      this.parkHouses[index] = response;
      this.addedSectorToParkHouse.next(response);
    }, error => this.handleError(error));

  }

  //Szektor eltávolítása
  removeSector(parkHouse: ParkHouse, sector: Sector) {
    this.commonService.isLoading = true;
    this.http.delete<{
      deletedId: number,
      parkHouseFreeplCount: number,
      parkHouseOccupiedPlCount: number
    }>(CommonData.hostUri + 'auth/sectors/delete/' + sector.id, {
      headers: new HttpHeaders({ 'Authorization': `Basic ${this.commonService.authToken}` })
    }).subscribe(response => {
      this.commonService.isLoading = false;
      let index = parkHouse.sectors.findIndex(elem => elem.id == response.deletedId);
      parkHouse.sectors.splice(index, 1);
      parkHouse.freePlCount = response.parkHouseFreeplCount;
      parkHouse.occupiedPlCount = response.parkHouseOccupiedPlCount;
      this.removedSectorToParkHouse.next(true);
    }, error => this.handleError(error));
  }


  //Parkoló keresése id alapján az összes parkolóház közül.
  getParkingLot(id: number): ParkingLot {
    for (let parkHouse of this.parkHouses) {
      for (let sector of parkHouse.sectors) {
        let pl: ParkingLot = sector.parkingLots.find(pl => pl.id === id);
        if (pl) {
          return pl;
        }
      }
    }
  }


  //Hibakezelés
  handleError(error: HttpErrorResponse) {
    this.commonService.isLoading = false;
    console.log(error);
    switch (error.status) {
      case 0: this.errorOccured.next(CommonData.unknownErrorText); break;
      case 400:
        if (error.error.errors[0] != null) {
          this.errorOccured.next("A szintek számának pozitív számnak kell lennie."); break;
        }
        this.errorOccured.next(error.error.message); break;
      case 401: this.errorOccured.next(error.error); break;
      case 500: this.errorOccured.next(error.error.error); break;
      default: this.errorOccured.next(error.message);
    }
  }

}
