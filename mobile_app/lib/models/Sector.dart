import 'package:flutter/foundation.dart';
import 'package:mobile_app/models/parkHouse.dart';

class Sector{
  int id;
  String name;
  ParkHouse parkHouse;
  int freeParkingLotCount;

  Sector({this.id, @required this.name, this.parkHouse, this.freeParkingLotCount=0});
}