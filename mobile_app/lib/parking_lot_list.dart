import 'package:flutter/material.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/parking_lot_tile.dart';

class ParkingLotList extends StatelessWidget {
  final List<ParkingLot> parkingLots;
  ParkingLotList(this.parkingLots);
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Wrap(
        spacing: 10,
        children: parkingLots.map((parkingLot){
          return ParkingLotTile(parkingLot);
        }).toList(),
      ),
    );
  }
}