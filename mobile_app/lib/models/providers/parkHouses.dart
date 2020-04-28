import 'dart:convert';

import 'package:enum_to_string/enum_to_string.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/models/common_data.dart';
import 'package:mobile_app/models/parkHouse.dart';

import '../Sector.dart';
import '../car.dart';
import '../parkingLot.dart';
import '../role.dart';
import '../user.dart';

class ParkHouses with ChangeNotifier {
  List<ParkHouse> _parkHouses = [];

  Future<void> loadParkHouses() async {
    try {
      http.Response response =
          await http.get('${Common.hostUri}auth/parkHouses/all', headers: {
        'authorization': Common.authToken,
        "content-type": "application/json; charset=utf-8"
      });
      Map<String, dynamic> reponseDecoded =
          json.decode(response.body) as Map<String, dynamic>;
      List<dynamic> phList = reponseDecoded['parkHouses'];
      List<dynamic> carList = reponseDecoded['cars'];
      this._parkHouses = _extractParkHouses(phList, carList);
    } catch (error) {
      print(error);
    }
  }

  List<ParkHouse> _extractParkHouses(List<dynamic> phList, List<dynamic> carList){
    List<Car> cars = _extractCars(carList);
    List<ParkHouse> parkHouses = [];
    phList.forEach((ph) {
        ParkHouse currentPh = ParkHouse(
            id: ph['id'],
            name: ph['name'],
            address: ph['address'],
            parkingLotCount: ph['freePlCount'],
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
            ParkingLot parkingLot =
                ParkingLot(id: pl['id'], name: pl['name'], sector: sector);
            if (pl['occupiingCar'] != null) {
              Car carToPutin = cars
                  .firstWhere((car) => car.plareNumber == pl['occupiingCar']);
              carToPutin.occupiedParkingLot = parkingLot;
              parkingLot.occupiingCar = carToPutin;
            }
            sector.parkingLots.add(parkingLot);
          });

          currentPh.sectors.add(sector);
        });
        parkHouses.add(currentPh);
      });
      return parkHouses;
  }

  List<Car> _extractCars(List<dynamic> carList){
    List<Car> cars = [];
    carList.forEach((car) {
        cars.add(Car(
            plareNumber: car['plateNumber'],
            owner: User(
                id: car['owner']['id'],
                email: car['owner']['email'],
                firstName: car['owner']['firstName'],
                lastName: car['owner']['lastName'],
                role: EnumToString.fromString(
                    Role.values, car['owner']['role']))));
      });
    return cars;
  }

  ParkingLot findParkingLotById(int id){
    for(ParkHouse parkHouse in this._parkHouses){
      for(Sector sector in parkHouse.sectors){
        ParkingLot pl = sector.parkingLots.firstWhere((pl)=>pl.id==id, orElse: ()=>null);
        if(pl!=null){
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
