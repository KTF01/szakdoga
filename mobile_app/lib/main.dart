import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_app/models/providers/auth.dart';
import 'package:mobile_app/models/providers/parkHouses.dart';
import 'package:mobile_app/screens/login_screen.dart';
import 'package:mobile_app/screens/park_houses/park_houses_screen.dart';
import 'package:mobile_app/tabs_screen.dart';
import 'package:provider/provider.dart';

import 'screens/park_house_detail_screen.dart';
import 'screens/parking_lot_detail/parking_lot_detail_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations(
      [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]);
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (BuildContext context) => ParkHouses(),
        ),
        ChangeNotifierProvider(
          create: (BuildContext ctx) => AuthManager(),
        )
      ],
      child: MaterialApp(
        title: 'Parking App',
        theme: ThemeData(primarySwatch: Colors.blue, accentColor: Colors.white),
        home: AuthScreen(),
        routes: {
          ParkHouseDetail.routeName: (ctx) => ParkHouseDetail(),
          ParkingLotDetailScreen.routeName: (ctx) => ParkingLotDetailScreen(),
          TabsScreen.routeName: (ctx) => TabsScreen('Parkign App'),
        },
      ),
    );
  }
}
