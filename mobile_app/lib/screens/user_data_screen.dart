import 'package:date_format/date_format.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:mobile_app/add_car_popup_content.dart';
import 'package:mobile_app/common/sure_dialog.dart';
import 'package:mobile_app/models/providers/auth.dart';
import 'package:mobile_app/models/providers/parkHouses.dart';
import 'package:mobile_app/models/user.dart';
import 'package:mobile_app/screens/CarData.dart';
import 'package:provider/provider.dart';

class UserData extends StatefulWidget {
  @override
  _UserDataState createState() => _UserDataState();
}

class _UserDataState extends State<UserData> {
  bool _isInit = true;

  @override
  void didChangeDependencies() {
    if (_isInit) {
      Provider.of<AuthManager>(context).fetchLoggedInUserData().then((_) {
        setState(() {
          _isLoading=false;
        });
      });
    }
    _isInit = false;
    super.didChangeDependencies();
  }

  void _startAddCar(AuthManager authManager) {
    setState(() {
      selectedIndex = -1;
    });

    showDialog(context: context, child: AddCarPopup(authManager));
  }

  bool _isLoading = true;
  int selectedIndex = -1;

  @override
  Widget build(BuildContext context) {
    AuthManager authManager = Provider.of<AuthManager>(context);
    User loggedInUser = authManager.loggedInUser;

    return _isLoading
        ? Center(
            child: CircularProgressIndicator(
              backgroundColor: Theme.of(context).primaryColor,
            ),
          )
        : Column(
            children: <Widget>[
              Container(
                margin: EdgeInsets.only(bottom: 10),
                child: Center(
                    child: Column(
                  children: <Widget>[
                    Text(
                      loggedInUser.firstName + ' ' + loggedInUser.lastName,
                      style: TextStyle(fontSize: 40),
                    ),
                    Text(loggedInUser.email),
                  ],
                )),
              ),
              LayoutBuilder(
                  builder: (BuildContext context, BoxConstraints constraints) {
                return Container(
                  height: 100,
                  child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: loggedInUser.ownedCars.length + 1,
                      itemBuilder: (BuildContext ctx, int index) {
                        if (index >= loggedInUser.ownedCars.length) {
                          if (loggedInUser.ownedCars.length < 5)
                            return Container(
                              width: constraints.maxWidth * 0.2,
                              child: FittedBox(
                                child: RaisedButton(
                                  onPressed: () {
                                    _startAddCar(authManager);
                                  },
                                  child: FaIcon(FontAwesomeIcons.plus),
                                ),
                              ),
                            );
                        } else
                          return Card(
                            child: InkWell(
                              onTap: () {
                                setState(() {
                                  selectedIndex = index;
                                });
                              },
                              highlightColor: Theme.of(context).primaryColor,
                              child: Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Column(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceEvenly,
                                  children: <Widget>[
                                    Text(
                                      loggedInUser.ownedCars[index].plareNumber,
                                      style: TextStyle(fontSize: 20),
                                    ),
                                    FaIcon(FontAwesomeIcons.car)
                                  ],
                                ),
                              ),
                            ),
                          );
                      }),
                );
              }),
              if (selectedIndex >= 0 &&
                  selectedIndex < loggedInUser.ownedCars.length)
                CarData(loggedInUser.ownedCars[selectedIndex]),
                  loggedInUser.reservations.length > 0
                  ? Container(
                      height: 220,
                      child: ListView(
                        children: loggedInUser.reservations.map((res) {
                          return ListTile(
                            title: Text(
                                '${res.parkingLot.sector.parkHouse.name}/${res.parkingLot.sector.name}/${res.parkingLot.name}'),
                            subtitle: Text(
                              'Foglalás vége: ' +
                                  formatDate(res.endTime.toLocal(), [
                                    yyyy,
                                    "-",
                                    mm,
                                    "-",
                                    dd,
                                    " ",
                                    HH,
                                    ":",
                                    nn
                                  ]),
                            ),
                            trailing: RaisedButton(
                              child: Text("Lemondás"),
                              onPressed: () {
                                showDialog(
                                    context: context,
                                    builder: (BuildContext context) {
                                      return SureDialog(
                                        text: "Biztos lemondja a foglalását?",
                                        okText: "Igen",
                                        noText: "Nem",
                                        okAction: () async {
                                          await authManager
                                              .deleteReservation(res.parkingLot);
                                          setState(() {
                                            loggedInUser.reservations
                                                .remove(res);
                                          });
                                        },
                                      );
                                    });
                              },
                            ),
                          );
                        }).toList(),
                      ),
                    )
                  : Text("Nincsenek foglalásai!")
            ],
          );
  }
}
