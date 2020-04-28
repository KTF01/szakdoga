import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/models/Sector.dart';
import 'package:mobile_app/models/common_data.dart';

import 'car.dart';

class ParkingLot with ChangeNotifier {
  final int id;
  String name;
  Sector sector;
  Car occupiingCar;

  ParkingLot({this.id, @required this.name, this.sector, this.occupiingCar}) {
    if (this.occupiingCar != null) {
      this.occupiingCar.occupiedParkingLot = this;
    }
  }

  Future<void> parkOut() async {
    if (this.occupiingCar != null) {
      try {
        http.Response response = await http.put(
            '${Common.hostUri}auth/parkingLots/parkOut/${this.id}',
            headers: {'authorization': Common.authToken});
        print(response.body);

        if (response.statusCode != 403) {
          this.occupiingCar.occupiedParkingLot = null;
          this.occupiingCar = null;
        }else{
          throw HttpException("Csak admin állhat ki más nevében!");
        }
      } catch (error) {
        print(error);
      }

      notifyListeners();
    }
  }

  Future<void> parkIn(Car car) async {
    if (this.occupiingCar == null) {
      try {
        http.Response response = await http.put(
            '${Common.hostUri}auth/parkingLots/parkIn/${this.id}/${car.plareNumber}',
            headers: {'authorization': Common.authToken});
        print(response.body);
        this.occupiingCar = car;
        car.occupiedParkingLot = this;
      } catch (error) {
        print(error);
      }

      notifyListeners();
    }
  }
}
