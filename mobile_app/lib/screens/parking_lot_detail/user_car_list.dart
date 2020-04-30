import 'package:flutter/material.dart';
import 'package:mobile_app/models/car.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/models/providers/auth.dart';
import 'package:provider/provider.dart';

class UserCarList extends StatefulWidget {
  final ParkingLot parkingLot;
  UserCarList(this.parkingLot);

  @override
  _UserCarListState createState() => _UserCarListState();
}

class _UserCarListState extends State<UserCarList> {
  bool _isLoading = false;

  void _startParkIn(AuthManager auth, Car car) async {
    setState(() {
      _isLoading = true;
    });

    try{
      await widget.parkingLot.parkIn(car);
      auth.setupNotification(car.occupiedParkingLot.id, car.occupiedParkingLot);
    }catch (error){
      print(error);
    }
    
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    AuthManager auth = Provider.of<AuthManager>(context);
    List<Car> cars = auth.loggedInUser.ownedCars;
    return Column(
      children: <Widget>[
        Container(
          height: MediaQuery.of(context).size.height * 0.5,
          child: _isLoading
              ? Center(
                  child: CircularProgressIndicator(
                    backgroundColor: Theme.of(context).primaryColor,
                  ),
                )
              : ListView(
                  children: cars.map((Car car) {
                    return Card(
                      child: InkWell(
                          onTap: () {
                            _startParkIn(auth, car);
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
