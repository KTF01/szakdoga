import 'package:date_format/date_format.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app/common/loadable_button.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:mobile_app/models/role.dart';
import 'package:mobile_app/screens/parking_lot_detail/empty_view.dart';
import 'package:mobile_app/screens/parking_lot_detail/make_reservation_panel.dart';
import 'package:mobile_app/screens/parking_lot_detail/parked_view.dart';
import './user_car_list.dart';
import 'package:mobile_app/services/notification_service.dart';
import 'package:provider/provider.dart';

class ParkingLotDetailScreen extends StatefulWidget {
  static const String routeName = "/parkingLotDetials";
  @override
  _ParkingLotDetailScreenState createState() => _ParkingLotDetailScreenState();
}

class _ParkingLotDetailScreenState extends State<ParkingLotDetailScreen> {
  AppBar myAppbar = AppBar();
  bool _isLoading = false;

  void _parkOutStart(CommonProvider commonProvider, ParkingLot parkingLot) {
    setState(() {
      _isLoading = true;
    });
    commonProvider.parkOut(parkingLot).then((_) {
      NotificationService.notificationsPlugin.cancel(parkingLot.id);
      setState(() {
        errorText="";
        _isLoading = false;
      });
    }, onError: (error){
      setState(() {
        errorText=error.toString();
        _isLoading=false;
      });
    });
  }

  void refresh() {
    setState(() {});
  }
  String errorText = "";
  @override
  Widget build(BuildContext context) {
    ParkingLot parkingLot =
        ModalRoute.of(context).settings.arguments as ParkingLot;
    CommonProvider commonProvider = Provider.of<CommonProvider>(context);
    bool hasCar = parkingLot.occupyingCar != null;
    bool isMyCar = hasCar &&
        (parkingLot.occupyingCar.owner.id == commonProvider.loggedInUser.id);
    bool isMyReservation = parkingLot.isReserved &&
        parkingLot.reservation.user.id == commonProvider.loggedInUser.id;
    bool isAdmin = (commonProvider.loggedInUser.role != Role.ROLE_USER);
    bool reservDisabled = (!isMyCar && !isMyReservation);
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
          Column(
            children: <Widget>[
              parkingLot.isReserved
                  ? Container(
                      child: Text(
                      parkingLot.reservation.user.firstName +
                          " " +
                          parkingLot.reservation.user.lastName +
                          " részére lefoglalt parkoló.\nFoglalás vége: " +
                          formatDate(parkingLot.reservation.endTime.toLocal(),
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
              if (errorText != "")
                Text(
                  errorText,
                  style: TextStyle(color: Theme.of(context).errorColor),
                  textAlign: TextAlign.center,
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
                        pressFunction: () =>
                            _parkOutStart(commonProvider, parkingLot),
                        disabled: !isMyCar && !isAdmin,
                      );
                    } else {
                      return RaisedButton(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                        color: Theme.of(context).primaryColor,
                        textColor: Theme.of(context).primaryTextTheme.button.color,
                        onPressed: parkingLot.isReserved && !isMyReservation
                            ? null : () {
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
                      pressFunction: () async {
                        try {
                          await commonProvider.deleteReservation(parkingLot);
                          errorText="";
                        } catch (error) {
                          setState(() {
                            errorText=error.toString();
                          });
                        }
                      },
                    );
                  } else {
                    return RaisedButton(
                      child: Text("Foglalás"),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                      color: Theme.of(context).primaryColor,
                      textColor: Theme.of(context).primaryTextTheme.button.color,
                      onPressed: reservDisabled && hasCar || commonProvider.loggedInUser.reservations.length>2
                          ? null: () {
                              showModalBottomSheet(
                                context: context,
                                builder: (_) {
                                  return ReservationPanel(parkingLot);
                                },
                              ).then((value) {
                                errorText="";
                              });
                            },
                    );
                  }
                },
              )
            ],
          ),
        ],
      ),
    );
  }
}
