import 'dart:convert';
import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:mobile_app/models/common_data.dart';
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/models/reservation.dart';
import 'package:mobile_app/models/user.dart';
import 'package:http/http.dart' as http;

class ReservationService{
   Future<void> deleteReservation(ParkingLot parkingLot, User user) async {
    if (parkingLot.reservation != null) {
      try {
        await http.delete(
            '${Common.hostUri}auth/reservations/delete/${parkingLot.reservation.id}',
            headers: {'authorization': Common.authToken});
        user.reservations.removeWhere((res)=> res.id==parkingLot.reservation.id);
        parkingLot.reservation = null;
        parkingLot.isReserved = false;
      } catch (error) {
        handleError(error);
      }
    }
  }

  Future<Reservation> makeReservation(ParkingLot parkingLot ,User user, int duration) async {
    try {
      duration *= 3600000;
      http.Response response = await http.post(
        '${Common.hostUri}auth/reservations/reserve?plId=${parkingLot.id}&userId=${user.id}&duration=$duration',
        body: null,
        headers: {'authorization': Common.authToken},
      );
      dynamic responseReservation = jsonDecode(response.body);
      parkingLot.reservation = Reservation(
        id: responseReservation['id'],
        user: user,
        startTime: DateTime.parse(responseReservation['startTime']),
        endTime: DateTime.parse(responseReservation['endTime']),
        parkingLot: parkingLot
        
      );
      user.reservations.add(parkingLot.reservation);
      parkingLot.isReserved =true;
      return parkingLot.reservation;
    } catch (error) {
     handleError(error);
    }
  }

    handleError(Exception error){
    if(error is SocketException){
      throw new ErrorHint("Valami gond van! Lehet hogy a szerver nem elérhető!");
    }else{
      throw new ErrorHint("Ismeretlen hiba!");
    }
  }
}