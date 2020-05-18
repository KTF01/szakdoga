import 'package:flutter/foundation.dart';
import 'package:mobile_app/models/Sector.dart';

class ParkHouse{
  final int id;
  String name;
  String address;
  int parkingLotCount;
  List<Sector> sectors;
  double latitude;
  double longitude;

  ParkHouse({this.id, @required this.name, this.address, this.parkingLotCount=0, this.sectors, this.latitude, this.longitude}){
    if(sectors!=null){
      for(Sector sec in this.sectors){
        sec.parkHouse=this;
      }
    }
  }

}