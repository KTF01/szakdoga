import 'package:flutter/foundation.dart';
import 'package:mobile_app/models/car.dart';
import 'package:mobile_app/models/role.dart';

import 'reservation.dart';

class User {
  int id;
  String firstName;
  String lastName;
  Role role;
  String email;
  List<Car> ownedCars;
  List<Reservation> reservations;

  User({
    this.id,
    @required this.firstName,
    @required this.lastName,
    @required this.role,
    @required this.email,
    this.reservations,
    this.ownedCars
  }){
    if(this.ownedCars!=null){
      for(Car car in this.ownedCars){
        car.owner=this;
      }
    }
    if(this.reservations==null){
      this.reservations = [];
    }
  }
}
