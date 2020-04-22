import 'package:flutter/material.dart';
import 'package:mobile_app/ListElem.dart';
import 'package:mobile_app/models/parkHouse.dart';

class ParkHouseDetail extends StatelessWidget {
  static const routeName = '/parkHouseDetial';

  @override
  Widget build(BuildContext context) {
    ParkHouse parkHouse =
        ModalRoute.of(context).settings.arguments as ParkHouse;

    AppBar myAppBar = AppBar(
      title: Text(parkHouse.name),
    );
    return Scaffold(
      appBar: myAppBar,
      body: Column(
        children: <Widget>[
          Column(
            children: <Widget>[
              Container(
                width: double.infinity,
                child: Text(
                  parkHouse.name,
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 40),
                ),
              ),
              Text(parkHouse.address),
            ],
          ),
          Container(
            height: (MediaQuery.of(context).size.height -
                    myAppBar.preferredSize.height) *
                0.7,
            child: ListView.builder(
              itemBuilder: (ctx, index) {
                return ListElem(
                  title: parkHouse.sectors[index].name,
                  subtitle: parkHouse.sectors[index].parkHouse.name,
                  trailing: parkHouse.sectors[index].freeParkingLotCount.toString(),
                );
              },
              itemCount: parkHouse.sectors!=null? parkHouse.sectors.length:0,
            ),
          ),
        ],
      ),
    );
  }
}
