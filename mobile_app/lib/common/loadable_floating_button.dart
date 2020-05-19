import 'package:flutter/material.dart';

class LoadableFloatingButton extends StatefulWidget {
  Function pressFunc;
  String tooltip;
  bool displayed;
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
    ):Container(height: 0,);
  }
}
