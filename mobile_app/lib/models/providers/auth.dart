import 'dart:convert';

import 'package:enum_to_string/enum_to_string.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/models/common_data.dart';
import 'package:mobile_app/models/user.dart';

import '../car.dart';
import '../parkingLot.dart';
import '../role.dart';

class AuthManager with ChangeNotifier {
  User _loggedInUser;

  User get loggedInUser {
    return _loggedInUser;
  }

  Future<void> loggIn(String email, String password) async {
    String token = 'Basic ' + base64Encode(utf8.encode('$email:$password'));
    const String url = "${Common.hostUri}auth/users/login";
    try {
      final http.Response response = await http.post(url, headers: {
        'authorization': token,
        "content-type": "application/json; charset=utf-8"
      });
      final extractedResponse =
          json.decode(response.body.toString()) as Map<String, dynamic>;

      this._loggedInUser = _extractUser(extractedResponse);
      Common.authToken = token;
    } catch (error) {
      print('ERROR: $error');
      throw error;
    }
  }

  User _extractUser(Map<String, dynamic> extractedResponse) {
    User logInUser = User(
      id: extractedResponse['user']['id'],
      email: extractedResponse['user']['email'],
      firstName: extractedResponse['user']['firstName'],
      lastName: extractedResponse['user']['lastName'],
      role: EnumToString.fromString(
          Role.values, extractedResponse['user']['role']),
    );

    List<Car> userCars = [];
    List<dynamic> extracedCars = extractedResponse['userCars'] as List<dynamic>;
    extracedCars.forEach((extractCar) {
      Map<String, dynamic> extractedParkingLot =
          extractCar['occupiedParkingLot'] as Map<String, dynamic>;
      Car responseCar =
          Car(plareNumber: extractCar['plateNumber'], owner: logInUser);

      ParkingLot occupiedParkingLot;
      if (extractedParkingLot != null) {
        occupiedParkingLot = ParkingLot(
            id: extractedParkingLot['id'],
            name: extractedParkingLot['name'],
            occupiingCar: responseCar);
        responseCar.occupiedParkingLot = occupiedParkingLot;
      }
      userCars.add(responseCar);
    });
    logInUser.ownedCars = userCars;
    return logInUser;
  }

  Future<void> fetchLoggedInUserData() async {
    try {
      http.Response response = await http
          .get(Common.hostUri + 'auth/users/${loggedInUser.id}', headers: {
        'authorization': Common.authToken,
      });
      final extractedResponse =
          json.decode(response.body.toString()) as Map<String, dynamic>;
      this._loggedInUser = _extractUser(extractedResponse);
    } catch (error) {
      print(error);
    }
  }

  void addCar(Car car) {
    //http kérés
    _loggedInUser.ownedCars.add(car);
    notifyListeners();
  }
}
