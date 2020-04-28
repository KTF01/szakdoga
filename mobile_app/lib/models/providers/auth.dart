import 'dart:convert';
import 'dart:io';

import 'package:enum_to_string/enum_to_string.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/models/common_data.dart';
import 'package:mobile_app/models/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../car.dart';
import '../parkingLot.dart';
import '../role.dart';
import 'parkHouses.dart';

class AuthManager with ChangeNotifier {
  User _loggedInUser;
  ParkHouses _parkHousesProvider;
  AuthManager.withParkHouses(this._parkHousesProvider);
  AuthManager();

  bool get isAuth{
    return Common.authToken!=null&&_loggedInUser!=null;
  }

  User get loggedInUser {
    return _loggedInUser;
  }

  Future<void> loggIn(String email, String password) async {
    String token = 'Basic ' + base64Encode(utf8.encode('$email:$password'));
    try {
      _loginWithToken(token);
    } catch (error) {
      print('ERROR: $error');
      throw error;
    }
  }

  Future<void> _loginWithToken(String token) async{
    const String url = "${Common.hostUri}auth/users/login";
    final http.Response response = await http.post(url, headers: {
        'authorization': token,
        "content-type": "application/json; charset=utf-8"
      });
      final extractedResponse =
          json.decode(response.body.toString()) as Map<String, dynamic>;

      this._loggedInUser = _extractUser(extractedResponse);
      Common.authToken = token;
      notifyListeners();
      SharedPreferences pref = await SharedPreferences.getInstance();
      pref.setString('token', Common.authToken);
      pref.setString('loginResponse', response.body);
  }

  Future<bool> autoLogin() async{
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if(prefs.containsKey('token')&&prefs.containsKey('loginResponse')){
      final extractedResponse =
          json.decode(prefs.get('loginResponse')) as Map<String, dynamic>;
      this._loggedInUser = _extractUser(extractedResponse);
      Common.authToken = prefs.get('token');
      notifyListeners();
      return true;
    }else{
      return false;
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
        occupiedParkingLot = _parkHousesProvider
            .findParkingLotById(extractedParkingLot['id'] as int);
        if (occupiedParkingLot != null) {
          occupiedParkingLot.occupiingCar = responseCar;
          responseCar.occupiedParkingLot = occupiedParkingLot;
        }
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

  Future<void> signUp(String firstName, String lastName, String email, String password) async {
    try {
      http.Response response = await http.post(Common.hostUri + 'users/signUp',
      headers: {
        "content-type": "application/json; charset=utf-8" 
      },
          body: json.encode({
            'firstName': firstName,
            'lastName': lastName,
            'email': email,
            'password': password,
          }));
      if(response.statusCode==409){
        throw HttpException(response.body);
      }
    } catch (error) {
      throw error;
    }
  }

  Future<void> addCar(Car car) async {
    try {
      http.Response response = await http.post(
          Common.hostUri + 'auth/cars/newCarToUser/${loggedInUser.id}',
          headers: {
            'authorization': Common.authToken,
            "content-type": "application/json; charset=utf-8"
          },
          body: json.encode({'plateNumber': car.plareNumber}));
      _loggedInUser.ownedCars.add(car);
      notifyListeners();
    } catch (error) {
      print(error);
    }
  }

  Future<void> removeCar(String plateNumber) async {
    try {
      http.Response response = await http.delete(
        Common.hostUri + 'auth/cars/delete/$plateNumber',
        headers: {
          'authorization': Common.authToken,
          "content-type": "application/json; charset=utf-8"
        },
      );
      this
          ._loggedInUser
          .ownedCars
          .removeWhere((car) => car.plareNumber == response.body);
      notifyListeners();
    } catch (error) {
      print(error);
    }
  }

  Future<void> logout() async{
    Common.authToken = null;
    _loggedInUser = null;
     SharedPreferences prefs = await SharedPreferences.getInstance();
     prefs.clear();
    notifyListeners();
  }
}
