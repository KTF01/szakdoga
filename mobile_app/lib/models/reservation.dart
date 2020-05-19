
import 'package:mobile_app/models/parkingLot.dart';
import 'package:mobile_app/models/user.dart';

class Reservation {
  final int id;
  DateTime startTime;
  DateTime endTime;
  User user;
  ParkingLot parkingLot;

  Reservation({this.id, this.startTime, this.endTime, this.user, this.parkingLot});
}