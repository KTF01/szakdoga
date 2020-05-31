import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:mobile_app/screens/user_detail/reservation_list.dart';
import '../login_screen.dart';
import './add_car_popup_content.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:mobile_app/models/user.dart';
import './CarData.dart';
import 'package:provider/provider.dart';

/**
 * A felhasználó adatait megjelenítő képernyő
 */

class UserData extends StatefulWidget {
  final double availableHeight;
  UserData(this.availableHeight);

  @override
  _UserDataState createState() => _UserDataState();
}

class _UserDataState extends State<UserData> {
  bool _isInit = true;

  @override
  void didChangeDependencies() {
    if (_isInit) { //Inicializálásnál betöltjük a felhasználó adatait.
      Provider.of<CommonProvider>(context).fetchLoggedInUserData().then((_) {
        setState(() {
          _isLoading = false;
        });
      }, onError: (error){
        if(error.toString().contains("A szerver nem elérhető!")){
          Navigator.pushReplacementNamed(context,AuthScreen.routeName);
        }
      });
    }
    _isInit = false;
    super.didChangeDependencies();
  }


  void _startAddCar(CommonProvider authManager) {
    setState(() {
      selectedIndex = -1;
    });
    //Autó hozzáadásakor megjelenítjük a felugró ablakot a rendszám beviteli mezőjével.
    showDialog(context: context, child: AddCarPopup(authManager));
  }

  bool _isLoading = true;
  int selectedIndex = -1;

  @override
  Widget build(BuildContext context) {
    CommonProvider commonProvider = Provider.of<CommonProvider>(context);
    User loggedInUser = CommonProvider.loggedInUser;
    double screenWidth = MediaQuery.of(context).size.width;
    bool isSelected =
        selectedIndex >= 0 && selectedIndex < loggedInUser.ownedCars.length;
    return GestureDetector( //Nyomhatóvá tesszük
      onTap: () {
        setState(() {
          selectedIndex = -1;
        });
      },
      child: _isLoading
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
                        Container(
                          height: widget.availableHeight * 0.07,
                          child: FittedBox(
                            child: Text(
                              loggedInUser.firstName +
                                  ' ' +
                                  loggedInUser.lastName,
                              style: TextStyle(fontSize: 40),
                            ),
                          ),
                        ),
                        Container(
                          height: widget.availableHeight * 0.03,
                          child: FittedBox(child: Text(loggedInUser.email)),
                        ),
                      ],
                    ),
                  ),
                ),
                Container(
                  height: widget.availableHeight * 0.2,
                  child: ListView.builder(//Scrollolható lista, ha nem fér bele az elérhet magasságba a tartalom.
                      scrollDirection: Axis.horizontal,
                      itemCount: loggedInUser.ownedCars.length + 1,
                      itemBuilder: (BuildContext ctx, int index) {
                        if (index >= loggedInUser.ownedCars.length) {
                          if (loggedInUser.ownedCars.length < 5)
                            return Container(
                              width: screenWidth * 0.2,
                              child: FittedBox(
                                child: RaisedButton(
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(30)),
                                  onPressed: () {
                                    _startAddCar(commonProvider);
                                  },
                                  child: FaIcon(FontAwesomeIcons.plus),
                                ),
                              ),
                            );
                        } else
                          return Card(
                            child: InkWell(//Nyomhatóvá tesszük
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
                                      loggedInUser.ownedCars[index].plateNumber,
                                      style: TextStyle(fontSize: 20),
                                    ),
                                    FaIcon(FontAwesomeIcons.car)
                                  ],
                                ),
                              ),
                            ),
                          );
                      }),
                ),
                if (isSelected) CarData(loggedInUser.ownedCars[selectedIndex]),
                loggedInUser.reservations.length > 0 && !isSelected
                    ? ReservationList(loggedInUser.reservations)
                    : Text("Nincsenek foglalásai!")
              ],
            ),
    );
  }
}
