import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:mobile_app/models/parkingLot.dart';

class ParkedInParkingLotView extends StatelessWidget {
  final ParkingLot parkingLot;

  ParkedInParkingLotView(this.parkingLot);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
        builder: (BuildContext ctx, BoxConstraints constraints) {
      return Container(
        height: constraints.maxHeight,
        child: Row(
          children: <Widget>[
            FittedBox(
              child: Container(
                child: Padding(
                  padding: const EdgeInsets.all(25.0),
                  child: FaIcon(FontAwesomeIcons.car, size: 300,),
                )
              ),
            ),
            Container(
              height: constraints.maxHeight,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  Text('Rendszám: ' + parkingLot.occupiingCar.plareNumber),
                  Text('Tulaj: ' +
                      parkingLot.occupiingCar.owner.firstName +
                      ' ' +
                      parkingLot.occupiingCar.owner.lastName),
                  
                ],
              ),
            )
          ],
        ),
      );
    });
  }
}
