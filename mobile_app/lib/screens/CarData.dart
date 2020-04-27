import 'package:flutter/material.dart';
import 'package:mobile_app/models/car.dart';

class CarData extends StatelessWidget {

  final Car car;
  CarData(this.car);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: <Widget>[
          Text(car.plareNumber),
          car.occupiedParkingLot!=null?Text(car.occupiedParkingLot.name):Text('Nem foglal parkolóhelyet!')
        ],
      ),
    );
  }
}