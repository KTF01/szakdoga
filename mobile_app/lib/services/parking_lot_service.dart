import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:mobile_app/models/car.dart';
import 'package:mobile_app/models/common_data.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:http/http.dart' as http;

class ParkingLotService {
    Future<void> parkOut(ParkingLot parkingLot) async {
    if (parkingLot.occupyingCar != null) {
      try {
        http.Response response = await http.put(
            '${Common.hostUri}auth/parkingLots/parkOut/${parkingLot.id}',
            headers: {'authorization': Common.authToken});
        print(response.body);

        if (response.statusCode != 403) {
          parkingLot.occupyingCar.occupiedParkingLot = null;
          parkingLot.occupyingCar = null;
        } else {
          handleError(HttpException("Csak admin állhat ki más nevében!"));
        }
      } catch (error) {
        handleError(error);
      }
    }
  }

  Future<void> parkIn(ParkingLot parkingLot,Car car) async {
    if (parkingLot.occupyingCar == null) {
      try {
        await http.put(
            '${Common.hostUri}auth/parkingLots/parkIn/${parkingLot.id}/${car.plateNumber}',
            headers: {'authorization': Common.authToken});
        if(car.occupiedParkingLot!=null){
          car.occupiedParkingLot.occupyingCar = null;
          car.occupiedParkingLot=null;
        }
        parkingLot.occupyingCar = car;
        car.occupiedParkingLot = parkingLot;
      } catch (error) {
        handleError(error);
      }
    }
  }

  handleError(Exception error){
    if(error is SocketException){
      throw new ErrorHint("Nem sikerült kapcsolódni a szerverhez!");
    }else if(error is HttpException){
      throw new ErrorHint(error.message);
    }
    else{
      throw new ErrorHint("Ismeretlen hiba!");
    }
  }
}