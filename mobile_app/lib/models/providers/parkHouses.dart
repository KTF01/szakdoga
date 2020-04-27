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
  List<ParkHouse> _parkHouses = [
    ParkHouse(
      id: 1,
      name: 'Parkház 1',
      address: 'Szamos utca 4.',
      sectors: [
        Sector(id: 0, name: 'sector 1', parkingLots: [
          ParkingLot(
            id: 0,
            name: 'P1',
            occupiingCar: Car(
                plareNumber: 'LFX-135',
                owner: User(
                    id: 2,
                    firstName: 'Nemes',
                    lastName: 'László',
                    email: 'laci@gmail.com',
                    role: Role.ROLE_USER)),
          ),
          ParkingLot(id: 1, name: 'P2'),
          ParkingLot(
            id: 2,
            name: 'P3',
            occupiingCar: Car(
              plareNumber: 'AB-D',
              owner: User(
                  id: 1,
                  firstName: 'Horváth',
                  lastName: 'Kristóf',
                  email: 'kristoofhorvath@gmail.com',
                  role: Role.ROLE_ADMIN),
            ),
          ),
          ParkingLot(id: 2, name: 'P3'),
        ]),
        Sector(id: 1, name: 'sector 2'),
      ],
    ),
    ParkHouse(id: 2, name: 'Parkház 2', address: 'Valami cím', sectors: [
      Sector(id: 2, name: 'Nagy szektor', parkingLots: [
        ParkingLot(id: 3, name: 'PS'),
      ]),
    ]),
    ParkHouse(id: 3, name: 'Parkiház', address: 'farok'),
  ];

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

  List<ParkHouse> get parkHouses {
    return [..._parkHouses];
  }
}
