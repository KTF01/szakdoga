import 'package:flutter/material.dart';
import 'package:mobile_app/common/loadable_button.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:provider/provider.dart';

class ReservationPanel extends StatefulWidget {

  final ParkingLot parkingLot;
  ReservationPanel(this.parkingLot);

  @override
  _ReservationPanelState createState() => _ReservationPanelState();
}

class _ReservationPanelState extends State<ReservationPanel> {
  int dropDownValue = 1;
  bool _isLoading = false;
  String errorText = "";
  @override
  Widget build(BuildContext context) {
    CommonProvider authManager = Provider.of<CommonProvider>(context);
    return Container(
      child: _isLoading? Center(child: CircularProgressIndicator( 
        backgroundColor: Theme.of(context).primaryColor,)
        ) : errorText==""? Column(
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
            try{
              await authManager.makeReservation(widget.parkingLot,authManager.loggedInUser, dropDownValue);
              Navigator.pop(context);
            }catch(error){
              setState(() {
                errorText=error.toString();
              });
              
            }
            
          })
        ],
      ): Text(errorText, style: TextStyle(color: Theme.of(context).errorColor), textAlign: TextAlign.center,),
    );
  }
}
