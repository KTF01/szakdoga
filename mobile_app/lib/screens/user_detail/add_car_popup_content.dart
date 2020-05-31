import 'package:flutter/material.dart';
import 'package:mobile_app/models/providers/common_provider.dart';

import '../../models/car.dart';

/**
 * Autó hozzáadásához szükséges felugró ablak.
 */

class AddCarPopup extends StatefulWidget {
  final CommonProvider auth;
  AddCarPopup(this.auth);

  @override
  _AddCarPopupState createState() => _AddCarPopupState();
}

class _AddCarPopupState extends State<AddCarPopup> {
  //Text input kezelésére használatos objektum
  TextEditingController plateNumberInputController =
      new TextEditingController();

  bool _isLoading = false;
  bool _showemptiAlert = false;
  String errorText = "";
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      content: Container(
        height: 80,
        child: _isLoading
            ? Center(
                child: CircularProgressIndicator(
                  backgroundColor: Theme.of(context).primaryColor,
                ),
              )
            : errorText==""? Column(
                children: <Widget>[
                  TextField(
                    controller: plateNumberInputController,
                    decoration:
                        InputDecoration(labelText: 'Új autó rendszáma: '),
                  ),
                  if (_showemptiAlert)
                    Text(
                      'Nem lehet üres!',
                      style: TextStyle(color: Theme.of(context).errorColor),
                    )
                ],
              ): Text(errorText, style: TextStyle(color: Theme.of(context).errorColor),),
      ),
      actions: <Widget>[
        RaisedButton(
          child: Text('Mentés'),
          onPressed: () async {
            if (plateNumberInputController.value.text == '') {
              setState(() {
                _showemptiAlert = true;//Ha üres a vlue akkor alertet mutatunk.
              });
              return;
            }
            setState(() {
              _isLoading = true;
            });
            try{
              await widget.auth.addCar(
                Car(plateNumber: plateNumberInputController.value.text));
            _isLoading = false;
            Navigator.pop(context);
            }catch(error){
              setState(() {
                errorText=error.toString();
                _isLoading=false;
              });
            }
            
          },
        ),
        RaisedButton(
            child: Text('Mégse'),
            onPressed: () {
              Navigator.pop(context);
            }),
      ],
    );
  }
}
