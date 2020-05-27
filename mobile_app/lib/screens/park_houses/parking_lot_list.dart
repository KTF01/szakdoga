import 'package:flutter/material.dart';
import '../../models/parkingLot.dart';
import './parking_lot_tile.dart';

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