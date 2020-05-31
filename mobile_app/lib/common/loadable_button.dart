import 'package:flutter/material.dart';

/**
 * Egy gomb ami aszinkron műveletek alatt töltő kört mutat.
 */

class LoadableButton extends StatefulWidget {
  //A végrehajtandó függvény referenciája
  final Function pressFunction;
  
  final String text;
  final bool disabled;

  LoadableButton({this.text, this.pressFunction, this.disabled = false});
  @override
  _LoadableButtonState createState() => _LoadableButtonState();
}

class _LoadableButtonState extends State<LoadableButton> {
  bool _isLoadig = false;
  @override
  Widget build(BuildContext context) {
    return _isLoadig
        ? Center(
            child: CircularProgressIndicator(
              backgroundColor: Theme.of(context).primaryColor,
            ),
          )
        : RaisedButton(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
            color: Theme.of(context).primaryColor,
                    textColor: Theme.of(context).primaryTextTheme.button.color,
            child: Text(widget.text),
            onPressed: widget.disabled
                ? null
                : () async {
                    setState(() {
                      _isLoadig = true;
                    });
                    await widget.pressFunction();
                    setState(() {
                      _isLoadig = false;
                    });
                  },
          );
  }
}
