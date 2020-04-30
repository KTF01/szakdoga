import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:mobile_app/models/car.dart';
import 'package:mobile_app/models/providers/auth.dart';
import 'package:provider/provider.dart';

class CarData extends StatefulWidget {
  final Car car;
  CarData(this.car);

  @override
  _CarDataState createState() => _CarDataState();
}

class _CarDataState extends State<CarData> {
  bool _isLoading = false;
  void _startParkOut(AuthManager auth) async {
    setState(() {
      _isLoading = true;
    });

    auth.cancelNotification(widget.car.occupiedParkingLot.id);
    await widget.car.occupiedParkingLot.parkOut();
    
    setState(() {
      _isLoading = false;
    });
  }

  void _startDelete(AuthManager auth) {
    showDialog(
        context: context,
        child: AlertDialog(
          content: Text(
              'Biztos törölni akarod a ${widget.car.plareNumber} rendszámú autódat?'),
          actions: <Widget>[
            RaisedButton(
              child: Text('Igen'),
              onPressed: () async {
                setState(() {
                  _isLoading = true;
                });
                Navigator.pop(context);
                await auth.removeCar(widget.car.plareNumber);
                setState(() {
                  _isLoading = false;
                });
              },
            ),
            RaisedButton(
              child: Text('Nem'),
              onPressed: () {
                Navigator.pop(context);
              },
            )
          ],
        ));
  }

  @override
  Widget build(BuildContext context) {
    AuthManager auth = Provider.of<AuthManager>(context);
    return _isLoading
        ? Center(
            child: CircularProgressIndicator(
              backgroundColor: Theme.of(context).primaryColor,
            ),
          )
        : Container(
            child: Column(
              children: <Widget>[
                Text(
                  widget.car.plareNumber,
                  style: TextStyle(fontSize: 25),
                ),
                widget.car.occupiedParkingLot != null
                    ? SizedBox(
                        height: 100,
                        width: MediaQuery.of(context).size.width * 0.6,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Text(
                                'Parkoló: ${widget.car.occupiedParkingLot.name}'),
                            Text(
                                'Szektor: ${widget.car.occupiedParkingLot.sector.name}'),
                            Text(
                                'Parkolóház: ${widget.car.occupiedParkingLot.sector.parkHouse.name}'),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: <Widget>[
                                RaisedButton(
                                    child: Text('Kiállás'),
                                    onPressed: ()=>_startParkOut(auth)),
                              ],
                            )
                          ],
                        ),
                      )
                    : Text('Nem foglal parkolóhelyet!'),
                RaisedButton(
                  child: FaIcon(
                    FontAwesomeIcons.trash,
                    color: Theme.of(context).accentColor,
                  ),
                  onPressed: () {
                    _startDelete(auth);
                  },
                  color: Theme.of(context).errorColor,
                )
              ],
            ),
          );
  }
}
