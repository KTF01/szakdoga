import 'package:flutter/foundation.dart';
import 'package:mobile_app/models/Sector.dart';

class ParkHouse{
  int id;
  String name;
  String address;
  int parkingLotCount;
  List<Sector> sectors;

  ParkHouse({this.id, @required this.name, this.address, this.parkingLotCount=0, this.sectors}){
    if(sectors!=null){
      for(Sector sec in this.sectors){
        sec.parkHouse=this;
        print('${sec.name} ${this.name}');
      }
    }
  }

}