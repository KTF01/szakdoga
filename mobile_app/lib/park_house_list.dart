import 'package:flutter/material.dart';
import 'package:mobile_app/ListElem.dart';
import 'package:mobile_app/models/Sector.dart';
import 'package:mobile_app/models/parkHouse.dart';
import 'package:mobile_app/park_house_detail_screen.dart';

class ParkHouseList extends StatefulWidget {
  @override
  _ParkHouseListState createState() => _ParkHouseListState();
}

class _ParkHouseListState extends State<ParkHouseList> {
  static final List<ParkHouse> _parkHouses = [
    ParkHouse(
      id: 1,
      name: 'Parkház 1',
      address: 'Szamos utca 4.',
      sectors: [
        Sector(id: 0, name: 'sector 1'),
        Sector(id: 0, name: 'sector 2'),
      ],
    ),
    ParkHouse(id: 2, name: 'Parkház 2', address: 'Valami cím'),
    ParkHouse(id: 3, name: 'Parkiház', address: 'farok'),
  ];

  void selectParkHouse(BuildContext ctx, ParkHouse selectedParkHouse) {
    Navigator.of(ctx)
        .pushNamed(ParkHouseDetail.routeName, arguments: selectedParkHouse);
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemBuilder: (ctx, index) {
        return ListElem(
          title: _parkHouses[index].name,
          subtitle: _parkHouses[index].address,
          trailing: _parkHouses[index].parkingLotCount.toString(),
          clickEvent: () => selectParkHouse(context, _parkHouses[index]),
        );
      },
      itemCount: _parkHouses.length,
    );
  }
}
