import 'package:flutter/material.dart';
import '../../common/ListElem.dart';
import 'package:mobile_app/models/parkHouse.dart';
import 'package:provider/provider.dart';

import '../../models/providers/park_houses_provider.dart';
import './park_house_detail_screen.dart';

class ParkHouseList extends StatefulWidget {
  @override
  _ParkHouseListState createState() => _ParkHouseListState();
}

class _ParkHouseListState extends State<ParkHouseList> {

  void selectParkHouse(BuildContext ctx, ParkHouse selectedParkHouse) {
    Navigator.of(ctx)
        .pushNamed(ParkHouseDetail.routeName, arguments: selectedParkHouse);
  }

  @override
  Widget build(BuildContext context) {
    ParkHousesProvider parkHousesProv = Provider.of<ParkHousesProvider>(context);
    List<ParkHouse> _parkHouses = parkHousesProv.parkHouses;
    return ListView.builder(
      itemBuilder: (ctx, index) {
        return ListElem(
          title: _parkHouses[index].name,
          subtitle: _parkHouses[index].address,
          trailing: Text('Szabad helyek: ' +
              _parkHouses[index].parkingLotCount.toString()),
          clickEvent: () => selectParkHouse(context, _parkHouses[index]),
        );
      },
      itemCount: _parkHouses.length,
    );
  }
}
