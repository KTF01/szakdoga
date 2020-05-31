import 'package:flutter/material.dart';
import '../../models/parkingLot.dart';
import './parking_lot_tile.dart';

/**
 * Parkolók listájának widgete
 */
class ParkingLotList extends StatelessWidget {
  final List<ParkingLot> parkingLots;
  ParkingLotList(this.parkingLots);
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Wrap(
        spacing: 10,
        children: parkingLots.map((parkingLot){
          return ParkingLotTile(parkingLot); //A map() függvénynel minden elembő ParkingLotTile widgetet csinálunk.
        }).toList(),
      ),
    );
  }
}