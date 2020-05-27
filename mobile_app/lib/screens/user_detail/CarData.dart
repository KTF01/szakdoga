import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:mobile_app/models/car.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:mobile_app/services/notification_service.dart';
import 'package:provider/provider.dart';

class CarData extends StatefulWidget {
  final Car car;
  CarData(this.car);

  @override
  _CarDataState createState() => _CarDataState();
}

class _CarDataState extends State<CarData> {
  bool _isLoading = false;
  String errorText = "";
  void _startParkOut(CommonProvider commonProvider) async {
    setState(() {
      _isLoading = true;
    });

    try {
      NotificationService.notificationsPlugin.cancel(widget.car.occupiedParkingLot.id);
      await commonProvider.parkOut(widget.car.occupiedParkingLot);
      setState(() {
        _isLoading = false;
        errorText="";
      });
    } catch (error) {
      setState(() {
        errorText=error.toString();
        _isLoading=false;
      });
    }
  }

  void _startDelete(CommonProvider commonProvider) {
    showDialog(
        context: context,
        child: AlertDialog(
          content: Text(
              'Biztos törölni akarod a ${widget.car.plateNumber} rendszámú autódat?'),
          actions: <Widget>[
            RaisedButton(
              child: Text('Igen'),
              onPressed: () async {
                setState(() {
                  _isLoading = true;
                });
                try{
                  Navigator.pop(context);
                  await commonProvider.removeCar(widget.car.plateNumber);
                  setState(() {
                    errorText="";
                    _isLoading = false;
                  });
                }catch(error){
                  setState(() {
                    errorText=error.toString();
                    _isLoading=false;
                  });
                  
                }
                
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
    CommonProvider commonProvider = Provider.of<CommonProvider>(context);
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
                  widget.car.plateNumber,
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
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(30)),
                                    color: Theme.of(context).primaryColor,
                                    textColor: Theme.of(context)
                                        .primaryTextTheme
                                        .button
                                        .color,
                                    child: Text('Kiállás'),
                                    onPressed: () => _startParkOut(commonProvider)),
                              ],
                            )
                          ],
                        ),
                      )
                    : Text('Nem foglal parkolóhelyet!'),
                RaisedButton(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30)),
                  child: FaIcon(
                    FontAwesomeIcons.trash,
                    color: Theme.of(context).accentColor,
                  ),
                  onPressed: () {
                    _startDelete(commonProvider);
                  },
                  color: Theme.of(context).errorColor,
                ),
                if(errorText!="") Text(errorText, style: TextStyle(color: Theme.of(context).errorColor),),
              ],
            ),
          );
  }
}
