import 'package:flutter/material.dart';
import 'package:mobile_app/models/car.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/models/providers/auth.dart';
import 'package:provider/provider.dart';

class UserCarList extends StatelessWidget {

  final ParkingLot parkingLot;
  UserCarList(this.parkingLot);

  @override
  Widget build(BuildContext context) {
    AuthManager auth = Provider.of<AuthManager>(context);
    List<Car> cars = auth.loggedInUser.ownedCars;
    return Column(
      children: <Widget>[
        Container(
          height: MediaQuery.of(context).size.height * 0.5,
          child: ListView(
            children: cars.map((Car car) {
              return Card(
                child: InkWell(
                    onTap: () {
                      parkingLot.parkIn(car);
                      Navigator.pop(context);
                    },
                    highlightColor: Theme.of(context).primaryColor,
                    child: ListTile(
                        leading: Icon(Icons.directions_car),
                        title: Text(
                          car.plareNumber,
                          style: TextStyle(fontSize: 30),
                        ))),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
