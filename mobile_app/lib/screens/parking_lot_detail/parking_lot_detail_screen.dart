import 'package:flutter/material.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/screens/parking_lot_detail/empty_view.dart';
import 'package:mobile_app/screens/parking_lot_detail/parked_view.dart';
import 'package:mobile_app/screens/parking_lot_detail/user_car_list.dart';
import 'package:provider/provider.dart';

class ParkingLotDetailScreen extends StatefulWidget {
  static const String routeName = "/parkingLotDetials";
  @override
  _ParkingLotDetailScreenState createState() => _ParkingLotDetailScreenState();
}

class _ParkingLotDetailScreenState extends State<ParkingLotDetailScreen> {
  AppBar myAppbar = AppBar();
  bool _isLoading = false;

  void _parkOutStart(ParkingLot parkingLot) {
    setState(() {
      _isLoading = true;
    });
    parkingLot.parkOut().then((_) {
      setState(() {
        _isLoading = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    ParkingLot parkingLot =
        ModalRoute.of(context).settings.arguments as ParkingLot;
    return Scaffold(
      appBar: myAppbar,
      body: Column(
        children: <Widget>[
          Container(
            child: Text(
              parkingLot.name,
              style: TextStyle(fontSize: 40),
            ),
          ),
          ChangeNotifierProvider.value(
            value: parkingLot,
            child: Consumer<ParkingLot>(
              builder: (BuildContext ctx, ParkingLot parkingLot, child) =>
                  Column(
                children: <Widget>[
                  Container(
                    height: (MediaQuery.of(context).size.height -
                            myAppbar.preferredSize.height) *
                        0.2,
                    child: parkingLot.occupiingCar != null
                        ? ParkedInParkingLotView(parkingLot)
                        : EmptyParkingLotView(),
                  ),
                  LayoutBuilder(
                      builder: (BuildContext ctx, BoxConstraints constraints) {
                    if (_isLoading) {
                      return CircularProgressIndicator(
                        backgroundColor: Theme.of(context).primaryColor,
                      );
                    } else {
                      if (parkingLot.occupiingCar != null) {
                        return RaisedButton(
                          onPressed: ()=>_parkOutStart(parkingLot),
                          child: Text('Kiállás'),
                        );
                      } else {
                        return RaisedButton(
                          onPressed: () {
                            showModalBottomSheet(
                                context: context,
                                builder: (_) {
                                  return UserCarList(parkingLot);
                                });
                          },
                          child: Text('Beállás'),
                        );
                      }
                    }
                  })
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
