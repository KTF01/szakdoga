import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import '../../models/parkingLot.dart';
import '../parking_lot_detail/parking_lot_detail_screen.dart';

/*
 * Egy parkolócsempt megjelenítő widget.
 */

class ParkingLotTile extends StatelessWidget {

  final ParkingLot parkingLot;
  ParkingLotTile(this.parkingLot);
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 5,
      child: InkWell( //Inkwellel nomhatóvá tesszük.
        onTap: () {
          Navigator.of(context).pushNamed(ParkingLotDetailScreen.routeName, arguments: parkingLot);
        },
        highlightColor: Theme.of(context).primaryColor,
        child: Container(
          color: parkingLot.isReserved? Colors.black54 : Colors.white,
          width: 60,
          height: 70,
          child: Padding(
            padding: EdgeInsets.all(10),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Text(parkingLot.name),
                if(parkingLot.occupyingCar!=null) FaIcon(FontAwesomeIcons.car) //Ha parkolnak benne akkor autó ikon jelenik meg
              ],
            ),
          ),
        ),
      ),
    );
  }
}
