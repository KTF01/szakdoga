import 'package:flutter/material.dart';
import 'package:mobile_app/models/providers/auth.dart';

import 'models/car.dart';

class AddCarPopup extends StatefulWidget {
  AuthManager auth;
  AddCarPopup(this.auth);

  @override
  _AddCarPopupState createState() => _AddCarPopupState();
}

class _AddCarPopupState extends State<AddCarPopup> {
  TextEditingController plateNumberInputController =
      new TextEditingController();

  bool _isLoading = false;
  bool _showemptiAlert = false;
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      content: _isLoading
          ? Center(
            child: CircularProgressIndicator(
                backgroundColor: Theme.of(context).primaryColor,
              ),
          )
          : Container(
              height: 80,
              child: Column(
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
              ),
            ),
      actions: <Widget>[
        RaisedButton(
          child: Text('Mentés'),
          onPressed: () async {
            if (plateNumberInputController.value.text == '') {
              setState(() {
                _showemptiAlert = true;
              });

              return;
            }
            setState(() {
              _isLoading = true;
            });
            Navigator.pop(context);
            await widget.auth.addCar(
                Car(plareNumber: plateNumberInputController.value.text));
            _isLoading = false;
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
