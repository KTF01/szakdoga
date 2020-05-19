import 'package:flutter/material.dart';
import 'package:mobile_app/common/loadable_floating_button.dart';
import 'package:mobile_app/models/parkHouse.dart';
import 'package:mobile_app/models/providers/auth.dart';
import 'package:mobile_app/models/providers/parkHouses.dart';
import 'package:mobile_app/park_house_list.dart';
import 'package:provider/provider.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../park_house_detail_screen.dart';

class ParkHousesScreen extends StatefulWidget {
  ParkHousesScreen({Key key}) : super(key: key);

  static const String routeName = '/parkHouses';

  @override
  _ParkHousesScreenState createState() => _ParkHousesScreenState();
}

class _ParkHousesScreenState extends State<ParkHousesScreen> {
  bool _isInit = true;
  bool _isLoading = false;
  BitmapDescriptor pinLocationIcon;
  BitmapDescriptor selfLocationIncon;
  @override
  void initState() {
    BitmapDescriptor.fromAssetImage(
            ImageConfiguration(size: Size(0, 0)), 'images/home-solid-smal.png')
        .then((onValue) {
      pinLocationIcon = onValue;
    });
    BitmapDescriptor.fromAssetImage(
            ImageConfiguration(size: Size(0, 0)), 'images/male-solid.png')
        .then((value) => selfLocationIncon = value);
    super.initState();
  }

  @override
  void didChangeDependencies() {
    if (_isInit) {
      setState(() {
        _isLoading = true;
      });
      Provider.of<ParkHouses>(context).loadParkHouses().then((_) {
        setState(() {
          _isLoading = false;
        });
      });
    }
    _isInit = false;
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    ParkHouses parkHousesProv = Provider.of<ParkHouses>(context);
    AuthManager authManager = Provider.of<AuthManager>(context);
    List<ParkHouse> _parkHouses = parkHousesProv.parkHouses;

    Set<Marker> _parkHouseMarkers = _parkHouses
        .map(
          (e) => Marker(
              markerId: MarkerId(e.id.toString()),
              position: LatLng(e.latitude, e.longitude),
              icon: pinLocationIcon,
              infoWindow: InfoWindow(
                title: e.name,
                snippet: e.address,
                onTap: () => Navigator.of(context)
                    .pushNamed(ParkHouseDetail.routeName, arguments: e),
              )),
        )
        .toSet();
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
            _isLoading
                ? CircularProgressIndicator(
                    backgroundColor: Theme.of(context).primaryColor,
                  )
                : Container(
                    height: (MediaQuery.of(context).size.height) * 0.4,
                    child: ParkHouseList(),
                  ),
            Container(
              height: (MediaQuery.of(context).size.height) * 0.33,
              child: GoogleMap(
                initialCameraPosition: CameraPosition(
                  target: LatLng(47.491800, 19.075364),
                ),
                minMaxZoomPreference: MinMaxZoomPreference(9, 50),
                cameraTargetBounds: CameraTargetBounds(
                  LatLngBounds(
                    southwest: LatLng(47.2, 18.7),
                    northeast: LatLng(47.7, 19.5),
                  ),
                ),
                markers: _parkHouseMarkers.union(
                  {
                    if(!authManager.locationDenied) Marker(
                      markerId: MarkerId('self'),
                      position: LatLng(authManager.devicePosition.latitude,
                          authManager.devicePosition.longitude),
                      icon: selfLocationIncon,
                      infoWindow: InfoWindow(title: "Ön itt áll!"),
                    ),
                  },
                ),
              ),
            )
          ],
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
        floatingActionButton: LoadableFloatingButton(
          displayed: !authManager.locationDenied,
          tooltip: "Legközelebbi parkolóház",
          pressFunc: () async {
            int id = await authManager.getClosestParkHouse();
            ParkHouse ph =
                _parkHouses.firstWhere((element) => element.id == id);
            Navigator.pushNamed(context, ParkHouseDetail.routeName,
                arguments: ph);
            print('Legozelebbi: ' + id.toString());
          },
        ));
  }
}
