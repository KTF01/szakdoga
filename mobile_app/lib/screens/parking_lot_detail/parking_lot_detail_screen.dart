import 'dart:developer';

import 'package:date_format/date_format.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app/common/loadable_button.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/models/providers/auth.dart';
import 'package:mobile_app/models/providers/parkHouses.dart';
import 'package:mobile_app/models/role.dart';
import 'package:mobile_app/screens/parking_lot_detail/empty_view.dart';
import 'package:mobile_app/screens/parking_lot_detail/make_reservation_panel.dart';
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

  void _parkOutStart(AuthManager authManager, ParkingLot parkingLot) {
    setState(() {
      _isLoading = true;
    });
    parkingLot.parkOut().then((_) {
      authManager.cancelNotification(parkingLot.id);
      setState(() {
        _isLoading = false;
      });
    });
  }

  void refresh() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    ParkingLot parkingLot =
        ModalRoute.of(context).settings.arguments as ParkingLot;
    AuthManager authManager = Provider.of<AuthManager>(context);
    bool hasCar = parkingLot.occupyingCar != null;
    bool isMyCar = hasCar &&
        (parkingLot.occupyingCar.owner.id == authManager.loggedInUser.id);
    bool isMyReservation = parkingLot.isReserved &&
        parkingLot.reservation.user.id == authManager.loggedInUser.id;
    bool isAdmin = (authManager.loggedInUser.role != Role.ROLE_USER);
    bool reservDisabled = !isMyCar && !isMyReservation;
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
                  parkingLot.isReserved
                      ? Container(
                          child: Text(
                          parkingLot.reservation.user.firstName +
                              " " +
                              parkingLot.reservation.user.lastName +
                              " részére lefoglalt parkoló.\nFoglalás vége: " +
                              formatDate(
                                  parkingLot.reservation.endTime.toLocal(),
                                  [yyyy, "-", mm, "-", dd, " ", HH, ":", nn]),
                        ))
                      : Container(
                          height: 0,
                        ),
                  Container(
                    height: (MediaQuery.of(context).size.height -
                            myAppbar.preferredSize.height) *
                        0.2,
                    child: parkingLot.occupyingCar != null
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
                        if (parkingLot.occupyingCar != null) {
                          return LoadableButton(
                            text: "Kiállás",
                            pressFunction: () => _parkOutStart(
                                authManager, parkingLot),
                            disabled: !isMyCar && !isAdmin,
                          );
                        } else {
                          return RaisedButton(
                            onPressed: parkingLot.isReserved && !isMyReservation
                                ? null
                                : () {
                                    showModalBottomSheet(
                                        context: context,
                                        builder: (_) {
                                          return UserCarList(parkingLot);
                                        }).then((_) {
                                      setState(() {});
                                    });
                                  },
                            child: Text('Beállás'),
                          );
                        }
                      }
                    },
                  ),
                  LayoutBuilder(
                    builder: (context, constraints) {
                      if (parkingLot.isReserved) {
                        return LoadableButton(
                          text: "Foglalás törlése",
                          disabled: reservDisabled && !isAdmin,
                          pressFunction: parkingLot.deleteReservation,
                        );
                      } else {
                        return RaisedButton(
                          child: Text("Foglalás"),
                          onPressed: reservDisabled && hasCar
                              ? null
                              : () {
                                  showModalBottomSheet(
                                    context: context,
                                    builder: (_) {
                                      return ReservationPanel(parkingLot);
                                    },
                                  ).then((value) {
                                    print(parkingLot.reservation.id);
                                  });
                                },
                        );
                      }
                    },
                  )
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
