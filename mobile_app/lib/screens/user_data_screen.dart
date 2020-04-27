import 'package:flutter/material.dart';
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
            height: 50,
            child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: loggedInUser.ownedCars.length,
                itemBuilder: (BuildContext ctx, int index) {
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
                        child: Center(
                            child: Text(
                          loggedInUser.ownedCars[index].plareNumber,
                          style: TextStyle(fontSize: 20),
                        )),
                      ),
                    ),
                  );
                }),
          );
        }),
        if (selectedIndex >= 0) CarData(loggedInUser.ownedCars[selectedIndex])
      ],
    );
  }
}
