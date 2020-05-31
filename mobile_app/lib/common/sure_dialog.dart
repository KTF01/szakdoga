import 'package:flutter/material.dart';

/**
 * Egy rákérdező felugró ablak. 
 */
class SureDialog extends StatefulWidget {
  //Az ablak üzenete
  final String text;
  //Az igenlő gomb felirata
  final String okText;
  //A tagadó gomb felirata
  final String noText;
  //Igenlő válasz esetén futtatandó függvény (Nem esetén csak bezárjuk az ablakot)
  final Function okAction;
  SureDialog({this.text, this.okText, this.noText, this.okAction});

  @override
  _SureDialogState createState() => _SureDialogState();
}

class _SureDialogState extends State<SureDialog> {
  bool _isLoadig = false;
  String errorText="";
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      content: Container(
        height: 40,
        child: _isLoadig
            ? Center(
                child: CircularProgressIndicator(
                backgroundColor: Theme.of(context).primaryColor,
              ))
            : errorText==""?
            Text(widget.text): 
            Text(errorText, style: TextStyle(color: Theme.of(context).errorColor),),
      ),
      actions: <Widget>[
        RaisedButton(
          child: Text(widget.okText),
          onPressed: () async {
            setState(() {
              _isLoadig = true;
            });
            try {
              await widget.okAction();
              Navigator.pop(context);//Bezárjuk a legfelső widgetet. (A popuppot)
            } catch (error) {
              setState(() {
                _isLoadig = false;
                errorText=error.toString();
              });
            }
          },
        ),
        RaisedButton(
          child: Text(widget.noText),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ],
    );
  }
}
