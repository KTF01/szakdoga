import 'dart:convert';
import 'dart:io';

import 'package:enum_to_string/enum_to_string.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/models/Sector.dart';
import 'package:mobile_app/models/common_data.dart';
import 'package:mobile_app/models/reservation.dart';
import 'package:mobile_app/models/role.dart';
import 'package:mobile_app/models/user.dart';

import 'car.dart';

class ParkingLot with ChangeNotifier {
  final int id;
  String name;
  Sector sector;
  Car occupyingCar;
  bool isReserved;
  Reservation reservation;

  ParkingLot(
      {this.id,
      @required this.name,
      this.sector,
      this.occupyingCar,
      this.isReserved}) {
    if (isReserved == null) isReserved = false;
    if (this.occupyingCar != null) {
      this.occupyingCar.occupiedParkingLot = this;
    }
  }

  Future<void> parkOut() async {
    if (this.occupyingCar != null) {
      try {
        http.Response response = await http.put(
            '${Common.hostUri}auth/parkingLots/parkOut/${this.id}',
            headers: {'authorization': Common.authToken});
        print(response.body);

        if (response.statusCode != 403) {
          this.occupyingCar.occupiedParkingLot = null;
          this.occupyingCar = null;
        } else {
          throw HttpException("Csak admin állhat ki más nevében!");
        }
      } catch (error) {
        print(error);
      }

      notifyListeners();
    }
  }

  Future<void> parkIn(Car car) async {
    if (this.occupyingCar == null) {
      try {
        http.Response response = await http.put(
            '${Common.hostUri}auth/parkingLots/parkIn/${this.id}/${car.plareNumber}',
            headers: {'authorization': Common.authToken});
        this.occupyingCar = car;
        car.occupiedParkingLot = this;
      } catch (error) {
        throw (error);
      }
      notifyListeners();
    }
  }

  Future<void> deleteReservation() async {
    if (this.reservation != null) {
      try {
        http.Response response = await http.delete(
            '${Common.hostUri}auth/reservations/delete/${this.reservation.id}',
            headers: {'authorization': Common.authToken});
        this.reservation = null;
        this.isReserved = false;
      } catch (error) {
        print("HIBAN: " + error);
      }
      notifyListeners();
    }
  }

  Future<void> makeReservation(User user, int duration) async {
    try {
      duration *= 3600000;
      http.Response response = await http.post(
        '${Common.hostUri}auth/reservations/reserve?plId=${this.id}&userId=${user.id}&duration=$duration',
        body: null,
        headers: {'authorization': Common.authToken},
      );
      dynamic responseReservation = jsonDecode(response.body);
      this.reservation = Reservation(
        id: responseReservation['id'],
        user: User(
          id: responseReservation['user']['id'],
          firstName: responseReservation['user']['firstName'],
          lastName: responseReservation['user']['lastName'],
          email: responseReservation['user']['email'],
          role: EnumToString.fromString(Role.values, responseReservation['user']['role'])
        ),
        startTime: DateTime.parse(responseReservation['startTime']),
        endTime: DateTime.parse(responseReservation['endTime']),
        parkingLot: this
        
      );
      this.isReserved =true;
      notifyListeners();
    } catch (error) {
      print("HIBA: " + error.toString());
    }
    
  }
}
