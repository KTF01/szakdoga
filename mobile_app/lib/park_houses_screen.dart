import 'package:flutter/material.dart';
import 'package:mobile_app/park_house_list.dart';

class ParkHouses extends StatefulWidget {
  ParkHouses({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _ParkHousesState createState() => _ParkHousesState();
}

class _ParkHousesState extends State<ParkHouses> {
  @override
  Widget build(BuildContext context) {
    AppBar myAppBar = AppBar(
      title: Text(widget.title),
    );
    return Scaffold(
      appBar: myAppBar,
      body: Column(
        children: <Widget>[
          Container(
            width: double.infinity,
            child: Text(
              'Parkolóházak',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 30),
            ),
          ),
          Container(
            height: (MediaQuery.of(context).size.height -
                    myAppBar.preferredSize.height) *
                0.7,
            child: ParkHouseList(),
          ),
        ],
      ),
    );
  }
}