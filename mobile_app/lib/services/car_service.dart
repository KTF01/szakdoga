import 'dart:convert';
import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:mobile_app/models/car.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/models/common_data.dart';
import 'package:mobile_app/models/user.dart';
/**
 * Autókkal kapcsolatos háttérhívások
 */
class CarService{
  
  //Autó hozzáadása
  Future<void> addCar(Car car, User user) async {
    try {
      await http.post(
          Common.hostUri + 'auth/cars/newCarToUser/${user.id}',
          headers: {
            'authorization': Common.authToken,
            "content-type": "application/json; charset=utf-8"
          },
          body: json.encode({'plateNumber': car.plateNumber}));
      car.owner=user;
      user.ownedCars.add(car);
    } catch (error) {
      handleError(error);
    }
  }
  //Autó eltávolítása
  Future<void> removeCar(String plateNumber, User user) async {
    try {
      http.Response response = await http.delete(
        Common.hostUri + 'auth/cars/delete/$plateNumber',
        headers: {
          'authorization': Common.authToken,
          "content-type": "application/json; charset=utf-8"
        },
      );
      user.ownedCars
          .removeWhere((car) => car.plateNumber == json.decode(response.body)['plateNumber']);
    } catch (error) {
      handleError(error);
    }
  }

  handleError(Exception error){
    if(error is SocketException){
      throw new ErrorHint("Nem sikerült kapcsolódni a szerverhez!");
    }else{
      throw new ErrorHint("Ismeretlen hiba!");
    }
  }
}