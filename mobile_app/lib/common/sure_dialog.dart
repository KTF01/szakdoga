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
            : Text(widget.text),
      ),
      actions: <Widget>[
        RaisedButton(
          child: Text(widget.okText),
          onPressed: () async {
            setState(() {
              _isLoadig = true;
            });
            await widget.okAction();
            Navigator.pop(context);
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
