import 'package:flutter/foundation.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/models/user.dart';

class Car {
  String plareNumber;
  ParkingLot occupiedParkingLot;
  User owner;

  Car({@required this.plareNumber, this.occupiedParkingLot, this.owner}) {
    if (this.owner != null) {
      if (this.owner.ownedCars != null) {
        this.owner.ownedCars.add(this);
      }
    }
  }
}
