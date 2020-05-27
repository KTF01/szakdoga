import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:mobile_app/models/providers/park_houses_provider.dart';
import 'package:mobile_app/screens/login_screen.dart';
import 'package:mobile_app/screens/splash_screen.dart';
import 'package:mobile_app/screens/tabs_screen.dart';
import 'package:mobile_app/services/notification_service.dart';
import 'package:provider/provider.dart';

import 'screens/park_houses/park_house_detail_screen.dart';
import 'screens/parking_lot_detail/parking_lot_detail_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  NotificationService.initNotification();
  SystemChrome.setPreferredOrientations(
      [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]);
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // Ez a Widget az alkalmazás gyökere.
  static const String title = 'Parkoló Kezelő';
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
        providers: [
          ChangeNotifierProvider(
            create: (BuildContext context) => ParkHousesProvider(),
          ),
          ChangeNotifierProxyProvider<ParkHousesProvider, CommonProvider>(
            update: (BuildContext ctx, parkHouses, previouscommonProv) =>
                CommonProvider.withParkHouses(parkHouses),
            create: (BuildContext ctx) => CommonProvider(),
          )
        ],
        child: Consumer<CommonProvider>(
          builder: (context, commonProv, _) {
            return MaterialApp(
              title:title,
              theme: ThemeData(
                  primarySwatch: Colors.blue, accentColor: Colors.white),
              home: commonProv.isAuth
                  ? TabsScreen(title)
                  : FutureBuilder(
                      future: commonProv.autoLogin(),
                      builder: (BuildContext ctx, commonProvResult) {
                        return commonProvResult.connectionState ==
                                ConnectionState.waiting
                            ? SplashScreen()
                            : AuthScreen();
                      },
                    ),
              routes: {
                ParkHouseDetail.routeName: (ctx) => ParkHouseDetail(),
                ParkingLotDetailScreen.routeName: (ctx) => ParkingLotDetailScreen(),
                TabsScreen.routeName: (ctx) => TabsScreen(title),
              },
            );
          },
        ));
  }
}
