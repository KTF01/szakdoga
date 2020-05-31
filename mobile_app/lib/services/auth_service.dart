import 'dart:convert';
import 'dart:io';

import 'package:enum_to_string/enum_to_string.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/models/car.dart';
import 'package:mobile_app/models/common_data.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/models/providers/park_houses_provider.dart';
import 'package:mobile_app/models/reservation.dart';
import 'package:mobile_app/models/role.dart';
import 'package:mobile_app/models/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'notification_service.dart';

class AuthService {
  Position _devicePosition;
  bool locationDenied = false;
  ParkHousesProvider _parkHouseProv;
  AuthService(this._parkHouseProv);

  Position get devicePosition {
    return _devicePosition;
  }

  //aszinkron hívás az alkalmazás szerver felé. Eredménye képpen resgosztráció történik
  Future<void> signUp(
      String firstName, String lastName, String email, String password) async {
    try {
      http.Response response = await http.post(Common.hostUri + 'users/signUp',
          headers: {"content-type": "application/json; charset=utf-8"},
          body: json.encode({
            'firstName': firstName,
            'lastName': lastName,
            'email': email,
            'password': password,
          }));
      if (response.statusCode == 409) { //Ha a válasz kódja 409 akkor hibát dobumnk
        throw HttpException(response.body);
      }
    } catch (error) {
      handleError(error);
    }
  }
  //Kijelentkezés
  Future<void> logout() async {
    Common.authToken = null;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.clear();
    NotificationService.notificationsPlugin.cancelAll();
  }

  //Bejelentkezés post kéréssel a szerver felé.
  Future<User> logIn(String token) async {
    try {
      const String url = "${Common.hostUri}auth/users/login";
      final http.Response response = await http.post(url, headers: {
        'authorization': token,
        "content-type": "application/json; charset=utf-8"
      });
       if(response.statusCode==401){
        throw HttpException("BAD_CREDENTIALS");
      }
      final extractedResponse =
          json.decode(response.body.toString()) as Map<String, dynamic>;

      //Válasz átalakítása sajét típusokká
      User user = _extractUser(extractedResponse);
      Common.authToken = token;
      SharedPreferences pref = await SharedPreferences.getInstance();
      pref.setString('token', Common.authToken);
      print(response.body);
      return user;
    } catch (error) {
      print('ERROR: $error');
      handleError(error);
      return null;
    }
  }
  //Megpróbáljuk lekérni az eszköz helyadatait.
  Future<bool> getDeviceLocation() async {
    try {
      _devicePosition = await Geolocator()
          .getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
    } on PlatformException catch (error) {//Ha nem sikerül akkor egy flag-et beállítunk
      this.locationDenied = true;
      print(error.message);
    }

    return true;
  }

  //Manuális belépés amihez kell paraméterben email és jelszó
  Future<User> manualLogIn(String email, String password) async {
    await getDeviceLocation();
    String token = 'Basic ' + base64Encode(utf8.encode('$email:$password'));
    return await logIn(token);
  }

  //Autómatikus belépés ami az eszköz tárhelyéből szedi az autentikációs tokent
  Future<User> autoLogin() async {
    await getDeviceLocation();
    SharedPreferences prefs = await SharedPreferences.getInstance();
    bool hasToken = prefs.containsKey('token');
    if (hasToken) {
      return await logIn(prefs.get('token'));
    } else {
      return null;
    }
  }

  //Felhasználó adatainak lekérdezése
  Future<User> fetchUserData(int userId) async {
    try {
      http.Response response =
          await http.get(Common.hostUri + 'auth/users/$userId', headers: {
        'authorization': Common.authToken,
      });
      final extractedResponse =
          json.decode(response.body.toString()) as Map<String, dynamic>;
      return _extractUser(extractedResponse);
    } catch (error) {
      handleError(error);
    }
    return null;
  }
  //A szervertől jövő válasz átkonvertálása saját típusokká
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
          Car(plateNumber: extractCar['plateNumber'], owner: logInUser);

      ParkingLot occupiedParkingLot;
      if (extractedParkingLot != null) {
        occupiedParkingLot =
            _parkHouseProv.findParkingLotById(extractedParkingLot['id'] as int);
        if (occupiedParkingLot != null) {
          occupiedParkingLot.occupyingCar = responseCar;
          responseCar.occupiedParkingLot = occupiedParkingLot;
        }
      }
      userCars.add(responseCar);
    });
    logInUser.ownedCars = userCars;

    List<Reservation> userReservations = [];
    List<dynamic> extractedReservations =
        extractedResponse['userReservations'] as List<dynamic>;
    extractedReservations.forEach((res) {
      Reservation reservationResponse = Reservation(
          id: res['id'],
          endTime: DateTime.parse(res['endTime']),
          startTime: DateTime.parse(res['startTime']),
          user: logInUser,
          parkingLot: _parkHouseProv
              .findParkingLotById(res['parkingLot']['id'] as int));
      userReservations.add(reservationResponse);
    });
    logInUser.reservations = userReservations;
    return logInUser;
  }

  handleError(Exception error) {
    if (error is http.ClientException) {
      throw new ErrorHint("Helytelen e-mailcím vagy jelszó!");
    } else if (error is PlatformException) {
      throw new ErrorHint("Hely adatok nem érhetőek el!");
    } else if (error is SocketException) {
      throw new ErrorHint("A szerver nem elérhető!");
    } else if (error is HttpException) {
      if (error.message.contains("EMAIL")) {
        throw new ErrorHint("Ezzel az e-mailcímmel már regisztráltak!");
      }else{
        if(error.message.contains("BAD_CREDENTIALS")){
          throw new ErrorHint("Helytelen e-mailcím vagy jelszó!");
        }
      }
    } else {
      throw new ErrorHint(error.toString());
    }
  }
}
