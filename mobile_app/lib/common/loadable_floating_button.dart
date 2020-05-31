import 'package:flutter/material.dart';

/**
 * Aszinkron műveletek alatt töltő kört mutató lebegő gomb.
 */

class LoadableFloatingButton extends StatefulWidget {
  final Function pressFunc;
  final String tooltip;
  final bool displayed;
  LoadableFloatingButton({this.tooltip ,this.pressFunc, this.displayed});

  @override
  _LoadableFloatingButtonState createState() => _LoadableFloatingButtonState();
}

class _LoadableFloatingButtonState extends State<LoadableFloatingButton> {
  bool _isLoading = false;
  @override
  Widget build(BuildContext context) {
    return widget.displayed? FloatingActionButton(
      disabledElevation: 0,
      child: _isLoading
          ? Center(
              child: CircularProgressIndicator(
              backgroundColor: Theme.of(context).primaryColor,
            ))
          : Icon(Icons.near_me),
      tooltip: widget.tooltip,
      onPressed: widget.pressFunc!=null? () async {
        setState(() {
          _isLoading=true;
        });
        await widget.pressFunc();
        setState(() {
          _isLoading=false;
        });
      }:null,
    ):Container(height: 0,); //Ha nem rajzoljuk ki akkor csak egy 0 magasságú konténert mutatunk ami = nem látszik semmi
  }
}
