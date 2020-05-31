import 'package:flutter/material.dart';
/**
 * Betöltés előtt míg a rendszer eldönt, hogy autómatikus vagy manuális bejelentkezés szükséges
 * addig ez a diget jelenik meg.
 */
class SplashScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
        child: Scaffold(
      body: Center(
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text('Betöltés'),
              CircularProgressIndicator(
                backgroundColor: Theme.of(context).primaryColor,
              )
            ]),
      ),
    ));
  }
}
