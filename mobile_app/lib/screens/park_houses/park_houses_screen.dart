import 'dart:io';
import 'dart:typed_data';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_app/common/loadable_floating_button.dart';
import 'package:mobile_app/models/parkHouse.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:mobile_app/models/providers/park_houses_provider.dart';
import 'package:mobile_app/screens/login_screen.dart';
import './park_house_list.dart';
import 'package:provider/provider.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import './park_house_detail_screen.dart';

/**
 * A parkolóházakat és a térképet megjelenítő widget.
 */

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

  //Kép betöltése bytokba, hogy lehessen méretezni.
  Future<Uint8List> getBytesFromAsset(String path, int width) async {
    ByteData data = await rootBundle.load(path);
    Codec codec = await instantiateImageCodec(data.buffer.asUint8List(),
        targetWidth: width);
    FrameInfo fi = await codec.getNextFrame();
    return (await fi.image.toByteData(format: ImageByteFormat.png))
        .buffer
        .asUint8List();
  }

  Uint8List houseIcon;
  Uint8List selfIcon;

  @override
  void didChangeDependencies() {
    if (_isInit) {
      //A képernyőhöz képest méretezzük az ikonokat
      int width = (MediaQuery.of(context).size.height/10).round();
      getBytesFromAsset('images/home-solid-smal.png', width).then((value) {
        houseIcon = value;
      });
      getBytesFromAsset('images/male-solid.png', (width/5.0).round()).then((value) {
        selfIcon = value;
      });

      setState(() {
        _isLoading = true;
      });
      //Provider-ren keresztül betöltjük a parkolóházakat
      Provider.of<ParkHousesProvider>(context).loadParkHouses().then((_) {
        setState(() {
          _isLoading = false;
        });
      }, onError: (error) {
        if (error is SocketException) { //Ha socket hiba keletkezik visszanavugálunk a bejelentkező képernyőre.
          Navigator.pushReplacementNamed(context, AuthScreen.routeName);
        }
      });
    }
    _isInit = false;
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    ParkHousesProvider parkHousesProv =
        Provider.of<ParkHousesProvider>(context);
    CommonProvider authManager = Provider.of<CommonProvider>(context);
    List<ParkHouse> _parkHouses = parkHousesProv.parkHouses;

    //A térképen használt jelölők.
    Set<Marker> _parkHouseMarkers = _parkHouses
        .map(
          (e) => Marker(
              markerId: MarkerId(e.id.toString()),
              position: LatLng(e.latitude, e.longitude),
              icon: BitmapDescriptor.fromBytes(houseIcon),
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
              height: widget.availableHeight * 0.1,
              child: Text(
                'Parkolóházak',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 30),
              ),
            ),
            _isLoading //A töltés van akkor forgő kört jelenítünk meg.
                ? CircularProgressIndicator(
                    backgroundColor: Theme.of(context).primaryColor,
                  )
                : Container( //Különben a parkolók listáját.
                    height: widget.availableHeight * 0.4,
                    child: ParkHouseList(),
                  ),
            if (!_isLoading)
              Container(
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
                      if (!authManager.authService.locationDenied)
                        Marker(
                          markerId: MarkerId('self'),
                          position: LatLng(authManager.devicePosition.latitude,
                              authManager.devicePosition.longitude),
                          icon: BitmapDescriptor.fromBytes(selfIcon),
                          infoWindow: InfoWindow(title: "Ön itt áll!"),
                        ),
                    },
                  ),
                ),
              )
          ],
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
        floatingActionButton: LoadableFloatingButton(//Legközelebbi parkolóház-hoz használt gomb
          displayed: !authManager.authService.locationDenied, //Ha nem elérhetőek a helyadatok akkor nem jelenik meg a gomb.
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
