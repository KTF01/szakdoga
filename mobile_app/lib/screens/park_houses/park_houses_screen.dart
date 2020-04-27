import 'package:flutter/material.dart';
import 'package:mobile_app/models/providers/parkHouses.dart';
import 'package:mobile_app/park_house_list.dart';
import 'package:provider/provider.dart';

class ParkHousesScreen extends StatefulWidget {
  ParkHousesScreen({Key key}) : super(key: key);

  static const String routeName = '/parkHouses';

  @override
  _ParkHousesScreenState createState() => _ParkHousesScreenState();
}

class _ParkHousesScreenState extends State<ParkHousesScreen> {
  bool _isInit =true;

  @override
  void didChangeDependencies(){
    if(_isInit){
      Provider.of<ParkHouses>(context).loadParkHouses().then((_){
        setState(() {
          
        });
      });
    }
    _isInit=false;
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
            height: (MediaQuery.of(context).size.height) * 0.6,
            child: ParkHouseList(),
          ),
        ],
      ),
    );
  }
}
