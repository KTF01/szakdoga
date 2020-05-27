import 'package:flutter/material.dart';

class SureDialog extends StatefulWidget {
  final String text;
  final String okText;
  final String noText;
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
              Navigator.pop(context);
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
