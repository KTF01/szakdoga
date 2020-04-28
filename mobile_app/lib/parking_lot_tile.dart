import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import 'models/parkingLot.dart';
import 'screens/parking_lot_detail/parking_lot_detail_screen.dart';

class ParkingLotTile extends StatelessWidget {

  final ParkingLot parkingLot;
  ParkingLotTile(this.parkingLot);
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 5,
      child: InkWell(
        onTap: () {
          Navigator.of(context).pushNamed(ParkingLotDetailScreen.routeName, arguments: parkingLot);
        },
        highlightColor: Theme.of(context).primaryColor,
        child: Container(
          width: 60,
          height: 70,
          child: Padding(
            padding: EdgeInsets.all(10),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Text(parkingLot.name),
                if(parkingLot.occupiingCar!=null) FaIcon(FontAwesomeIcons.car)
              ],
            ),
          ),
        ),
      ),
    );
  }
}
