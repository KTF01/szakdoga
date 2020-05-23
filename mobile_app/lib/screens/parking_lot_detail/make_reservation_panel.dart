import 'package:flutter/material.dart';
import 'package:mobile_app/common/loadable_button.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/models/providers/auth.dart';
import 'package:provider/provider.dart';

class ReservationPanel extends StatefulWidget {

  ParkingLot parkingLot;
  ReservationPanel(this.parkingLot);

  @override
  _ReservationPanelState createState() => _ReservationPanelState();
}

class _ReservationPanelState extends State<ReservationPanel> {
  int dropDownValue = 1;
  @override
  Widget build(BuildContext context) {
    AuthManager authManager = Provider.of<AuthManager>(context);
    return Container(
      child: Column(
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              DropdownButton<int>(
                value: dropDownValue,
                onChanged: (int newValue){
                  setState(() {
                    dropDownValue = newValue;
                  });
                } ,
                items: <int>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
                    .map(
                      (e) => DropdownMenuItem<int>(
                        value: e,
                        child: Text(e.toString()),
                      ),
                    )
                    .toList(),
              ),
              Text(" órára lefoglalom.")
            ],
          ),
          LoadableButton(text: "Lefoglal", pressFunction: () async {
            await authManager.makeReservation(widget.parkingLot,authManager.loggedInUser, dropDownValue);
            Navigator.pop(context);
          })
        ],
      ),
    );
  }
}
