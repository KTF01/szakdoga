import 'package:flutter/material.dart';

class LoadableButton extends StatefulWidget {
  final Function pressFunction;
  final String text;
  final bool disabled;

  LoadableButton({this.text, this.pressFunction, this.disabled=false});
  @override
  _LoadableButtonState createState() => _LoadableButtonState();
}

class _LoadableButtonState extends State<LoadableButton> {
  bool isLoadig = false;
  @override
  Widget build(BuildContext context) {
    return isLoadig
        ? Center(
            child: CircularProgressIndicator(
              backgroundColor: Theme.of(context).primaryColor,
            ),
          )
        : RaisedButton(
            child: Text(widget.text),
            onPressed: widget.disabled
                ? null
                : () async {
                    setState(() {
                      isLoadig = true;
                    });
                    await widget.pressFunction();
                    setState(() {
                      isLoadig = false;
                    });
                  },
          );
  }
}
