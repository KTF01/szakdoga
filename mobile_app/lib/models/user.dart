import 'package:flutter/foundation.dart';
import 'package:mobile_app/models/car.dart';
import 'package:mobile_app/models/role.dart';

class User {
  int id;
  String firstName;
  String lastName;
  Role role;
  String email;
  List<Car> ownedCars;

  User({
    this.id,
    @required this.firstName,
    @required this.lastName,
    @required this.role,
    @required this.email,
    this.ownedCars
  }){
    if(this.ownedCars!=null){
      for(Car car in this.ownedCars){
        car.owner=this;
      }
    }
  }
}
