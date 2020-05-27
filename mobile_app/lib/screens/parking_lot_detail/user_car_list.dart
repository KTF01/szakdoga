import 'package:flutter/material.dart';
import 'package:mobile_app/models/car.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:mobile_app/services/notification_service.dart';
import 'package:provider/provider.dart';

class UserCarList extends StatefulWidget {
  final ParkingLot parkingLot;
  UserCarList(this.parkingLot);

  @override
  _UserCarListState createState() => _UserCarListState();
}

class _UserCarListState extends State<UserCarList> {
  bool _isLoading = false;
  String errorText = "";

  void _startParkIn(CommonProvider auth, Car car) async {
    setState(() {
      _isLoading = true;
    });

    try {
      await auth.parkIn(widget.parkingLot,car);
      NotificationService.setupNotification(car.occupiedParkingLot.id, car.occupiedParkingLot);
       Navigator.pop(context);
    } catch (error) {
      setState(() {
        _isLoading=false;
        errorText=error.toString();
      });
      
    }

   
  }

  @override
  Widget build(BuildContext context) {
    CommonProvider auth = Provider.of<CommonProvider>(context);
    List<Car> cars = auth.loggedInUser.ownedCars;
    return Container(
      height: MediaQuery.of(context).size.height * 0.5,
      child: _isLoading
          ? Center(
              child: CircularProgressIndicator(
                backgroundColor: Theme.of(context).primaryColor,
              ),
            )
          : errorText==""?
           ListView(
              children: cars.map(
                (Car car) {
                  return Card(
                    child: InkWell(
                      onTap: () {
                        _startParkIn(auth, car);
                      },
                      highlightColor: Theme.of(context).primaryColor,
                      child: ListTile(
                        leading: Icon(Icons.directions_car),
                        title: Text(
                          car.plateNumber,
                          style: TextStyle(fontSize: 30),
                        ),
                      ),
                    ),
                  );
                },
              ).toList(),
            ):Text(errorText, textAlign: TextAlign.center, style: TextStyle(color :Theme.of(context).errorColor),),
    );
  }
}
