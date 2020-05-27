import 'package:flutter/material.dart';
import 'package:mobile_app/common/loadable_floating_button.dart';
import 'package:mobile_app/models/parkHouse.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:mobile_app/models/providers/park_houses_provider.dart';
import './park_house_list.dart';
import 'package:provider/provider.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import './park_house_detail_screen.dart';

class ParkHousesScreen extends StatefulWidget {
  final double availableHeight;
  ParkHousesScreen(this.availableHeight);

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
      Provider.of<ParkHousesProvider>(context).loadParkHouses().then((_) {
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
    ParkHousesProvider parkHousesProv = Provider.of<ParkHousesProvider>(context);
    CommonProvider authManager = Provider.of<CommonProvider>(context);
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
              height: widget.availableHeight*0.1,
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
                    height: widget.availableHeight * 0.4,
                    child: ParkHouseList(),
                  ),
            if(!_isLoading) Container(
              height: (MediaQuery.of(context).size.height) * 0.35,
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
                    if(!authManager.authService.locationDenied) Marker(
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
          displayed: !authManager.authService.locationDenied,
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
