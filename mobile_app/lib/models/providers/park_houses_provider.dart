import 'dart:convert';

import 'package:enum_to_string/enum_to_string.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/models/common_data.dart';
import 'package:mobile_app/models/parkHouse.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:mobile_app/models/reservation.dart';

import '../Sector.dart';
import '../car.dart';
import '../parkingLot.dart';
import '../role.dart';
import '../user.dart';

/**
 * Parkolóházakat kiszokáló provider.
 */

class ParkHousesProvider with ChangeNotifier {
  //Az applikációba betöltött parkolóházak, kezdetben üres tömb.
  List<ParkHouse> _parkHouses = [];

  //Parkolóházak betöltése az alkalmazásszerverről get kérés segítségével.
  Future<void> loadParkHouses() async {

      http.Response response =
          await http.get('${Common.hostUri}auth/parkHouses/all', headers: {
        'authorization': Common.authToken,
        "content-type": "application/json; charset=utf-8"
      });
      Map<String, dynamic> reponseDecoded =
          json.decode(response.body) as Map<String, dynamic>;
      List<dynamic> phList = reponseDecoded['parkHouses'];
      List<dynamic> carList = reponseDecoded['cars'];
      List<dynamic> reservationList = reponseDecoded['reservations'];
      //Válasz átalakítása az app típusaivá
      this._parkHouses = _extractParkHouses(phList, carList, reservationList);

  }

  //A három lista összeszerkesztése egymásra hivatkozó referenciákká.
  List<ParkHouse> _extractParkHouses(List<dynamic> phList,
      List<dynamic> carList, List<dynamic> reservationList) {
    List<Car> cars = _extractCars(carList);
    List<Reservation> reservations = _extractReservations(reservationList);
    List<ParkHouse> parkHouses = [];
    phList.forEach((ph) {
      ParkHouse currentPh = ParkHouse(
          id: ph['id'],
          name: ph['name'],
          address: ph['address'],
          parkingLotCount: ph['freePlCount'],
          latitude: ph['latitude'],
          longitude: ph['longitude'],
          sectors: []);

      List<dynamic> phSectors = ph['sectors'] as List<dynamic>;
      phSectors.forEach((s) {
        Sector sector = Sector(
            id: s['id'],
            name: s['name'],
            freePlCount: s['freePlCount'],
            parkHouse: currentPh,
            parkingLots: []);
        List<dynamic> sPls = s['parkingLots'] as List<dynamic>;
        sPls.forEach((pl) {
          ParkingLot parkingLot = ParkingLot(
              id: pl['id'],
              name: pl['name'],
              sector: sector,
              isReserved: pl['isReserved']);
          if (pl['occupyingCar'] != null) {
            Car carToPutin = CommonProvider.loggedInUser.ownedCars.firstWhere((element) => element.plateNumber==pl['occupyingCar'],
            orElse:()=> null);
            if(carToPutin==null) carToPutin = cars.firstWhere((car) => car.plateNumber == pl['occupyingCar']);
            carToPutin.occupiedParkingLot = parkingLot;
            parkingLot.occupyingCar = carToPutin;
          }
          if (parkingLot.isReserved) {
            Reservation reservationToPutIn = reservations.firstWhere((element) => element.id == pl['reservation']);
            reservationToPutIn.parkingLot = parkingLot;
            parkingLot.reservation = reservationToPutIn;
          }
          sector.parkingLots.add(parkingLot);
        });

        currentPh.sectors.add(sector);
      });
      parkHouses.add(currentPh);
    });
    return parkHouses;
  }

  //Külön az autók parse-olására fókuszáló függvény
  List<Car> _extractCars(List<dynamic> carList) {
    List<Car> cars = [];
    carList.forEach((car) {
      cars.add(Car(
          plateNumber: car['plateNumber'],
          owner: User(
              id: car['owner']['id'],
              email: car['owner']['email'],
              firstName: car['owner']['firstName'],
              lastName: car['owner']['lastName'],
              role:
                  EnumToString.fromString(Role.values, car['owner']['role']))));
    });
    return cars;
  }
  //Parkolók "kicsomagolása" a válaszból
  List<Reservation> _extractReservations(List<dynamic> reservationList) {
    List<Reservation> reservations = [];
    reservationList.forEach((r) {
      reservations.add(
        Reservation(
          id: r['id'],
          startTime: DateTime.parse(r['startTime']),
          endTime: DateTime.parse(r['endTime']),
          user: User(
            email: r['user']['email'],
            id: r['user']['id'],
            firstName: r['user']['firstName'],
            lastName: r['user']['lastName'],
            role: EnumToString.fromString(Role.values, r['user']['role']),
          ),
        ),
      );
    });
    return reservations;
  }

  //Parkoló keresése id alapján.
  ParkingLot findParkingLotById(int id) {
    for (ParkHouse parkHouse in this._parkHouses) {
      for (Sector sector in parkHouse.sectors) {
        ParkingLot pl = sector.parkingLots
            .firstWhere((pl) => pl.id == id, orElse: () => null);
        if (pl != null) {
          return pl;
        }
      }
    }
    return null;
  }

  //Parkolóhely keresése benne parkoló autó rendszáma alapján.
  ParkingLot findParkingLotByplateNumber(String plateNumber){
     for (ParkHouse parkHouse in this._parkHouses) {
      for (Sector sector in parkHouse.sectors) {
        ParkingLot pl = sector.parkingLots
            .firstWhere((pl) => pl.occupyingCar!=null&&pl.occupyingCar.plateNumber==plateNumber, orElse: () => null);
        if (pl != null) {
          return pl;
        }
      }
    }
    return null;
  }

  List<ParkHouse> get parkHouses {
    return [..._parkHouses];
  }

}
