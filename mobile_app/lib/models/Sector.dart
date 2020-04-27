import 'package:flutter/foundation.dart';
import 'package:mobile_app/models/parkHouse.dart';
import 'package:mobile_app/models/parkingLot.dart';

class Sector {
  int id;
  String name;
  ParkHouse parkHouse;
  int freePlCount;
  List<ParkingLot> parkingLots;

  Sector(
      {this.id,
      @required this.name,
      this.parkHouse,
      this.parkingLots,
      this.freePlCount = 0}) {
    if (this.parkingLots != null) {
      for (ParkingLot pl in this.parkingLots) {
        pl.sector = this;
      }
    }else{
      this.parkingLots=[];
    }
  }
}
