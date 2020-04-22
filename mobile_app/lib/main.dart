import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_app/park_house_detail_screen.dart';
import 'package:mobile_app/park_house_list.dart';
import 'package:mobile_app/park_houses_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]);
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Parking App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: ParkHouses(title: 'Parking App'),
      routes: {
        ParkHouseDetail.routeName: (ctx)=>ParkHouseDetail()
      },
    );
  }
}
