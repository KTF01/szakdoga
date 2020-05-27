import 'package:flutter/material.dart';
import 'package:mobile_app/models/parkHouse.dart';
import './sector_list_elem.dart';

class ParkHouseDetail extends StatelessWidget {
  static const routeName = '/parkHouseDetial';

  @override
  Widget build(BuildContext context) {
    ParkHouse parkHouse =
        ModalRoute.of(context).settings.arguments as ParkHouse;

    AppBar myAppBar = AppBar(
      title: Text(parkHouse.name),
    );

    double availableHeight =
        MediaQuery.of(context).size.height - myAppBar.preferredSize.height;

    return Scaffold(
      appBar: myAppBar,
      body: Column(
        children: <Widget>[
          Column(
            children: <Widget>[
              Container(
                height: availableHeight*0.07,
                width: double.infinity,
                child: FittedBox(
                                  child: Text(
                    parkHouse.name,
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 40),
                  ),
                ),
              ),
              Container(
                height: availableHeight*0.03,
                child: Text(parkHouse.address),
              ),
            ],
          ),
          Container(
            height: availableHeight*0.84,
            child: ListView.builder(
              itemBuilder: (ctx, index) {
                return SectorListElem(
                  parkHouse.sectors[index],
                );
              },
              itemCount:
                  parkHouse.sectors != null ? parkHouse.sectors.length : 0,
            ),
          ),
        ],
      ),
    );
  }
}
