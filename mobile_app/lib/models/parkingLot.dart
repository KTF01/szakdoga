import 'package:flutter/foundation.dart';
import 'package:mobile_app/models/Sector.dart';
import 'package:mobile_app/models/reservation.dart';

import 'car.dart';

class ParkingLot {
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
}
