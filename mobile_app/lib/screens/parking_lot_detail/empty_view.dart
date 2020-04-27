import 'package:flutter/material.dart';

class EmptyParkingLotView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height:
          (MediaQuery.of(context).size.height) *
              0.5,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Container(
              margin: EdgeInsets.symmetric(horizontal: 0, vertical: 10),
              child: Text('A parkoló üres'),
            ),
          ],
        ),
      ),
    );
  }
}
