import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:mobile_app/add_car_popup_content.dart';
import 'package:mobile_app/models/providers/auth.dart';
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
        setState(() {});
      });
    }
    _isInit = false;
    super.didChangeDependencies();
  }

  void _startAddCar( AuthManager authManager) {
    setState(() {
      selectedIndex = -1;
    });

    showDialog(
        context: context,
        child: AddCarPopup(authManager));
  }

  bool _isLoading = false;
  int selectedIndex = -1;
  

  @override
  Widget build(BuildContext context) {
    AuthManager authManager = Provider.of<AuthManager>(context);
    User loggedInUser = authManager.loggedInUser;

    return Column(
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
                      return _isLoading
                          ? Center(
                              child: CircularProgressIndicator(
                                backgroundColor: Theme.of(context).primaryColor,
                              ),
                            )
                          : Container(
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
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
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
        if (selectedIndex >= 0 && selectedIndex<loggedInUser.ownedCars.length) CarData(loggedInUser.ownedCars[selectedIndex])
      ],
    );
  }
}
