import 'package:flutter/cupertino.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/models/common_data.dart';
import 'package:mobile_app/models/reservation.dart';
import 'package:mobile_app/models/user.dart';
import 'package:mobile_app/services/auth_service.dart';
import 'package:mobile_app/services/car_service.dart';
import 'package:mobile_app/services/parking_lot_service.dart';
import 'package:mobile_app/services/reservation_service.dart';

import '../car.dart';
import '../parkingLot.dart';
import 'park_houses_provider.dart';

/**
 * Általános provider ami minden műveletnél értesíti a feliratkozott widgeteket.
 */

class CommonProvider with ChangeNotifier {
  static User _loggedInUser;
  ParkHousesProvider _parkHousesProvider;
  //Szükség van néhány helyen a parkolóházak providerére.
  CommonProvider.withParkHouses(parkHousesProvider){
    _parkHousesProvider = parkHousesProvider;
    authService = new AuthService(_parkHousesProvider);
  }
  CommonProvider();

  //A műveleteket végrehajtó kiszolgálók
  CarService carService = new CarService();
  ReservationService reservationService = new ReservationService();
  ParkingLotService parkingLotService = new ParkingLotService();
  AuthService authService;


  bool get isAuth {
    return Common.authToken != null && _loggedInUser != null;
  }

  //A bejelentkezett feéhasználó
  static User get loggedInUser {
    return _loggedInUser;
  }

  //Az eszköz helyadatai.
  Position get devicePosition {
    return authService.devicePosition;
  }

  //Ha nincs elemntve a bejelentkezési token akkor manuálisan a bejelentkező képernyőn keresztül lép be a felhasználó
  Future<void> manualLogIn(String email, String password) async {
    _loggedInUser = await authService.manualLogIn(email, password);
    notifyListeners();
  }

  //Ha van elmentett token akkor autómatikusan belép
  Future<bool> autoLogin() async {
    _loggedInUser =  await authService.autoLogin();
    bool result = _loggedInUser!=null;
    if(result) notifyListeners();
    return result;
  }

  
  Future<void> fetchLoggedInUserData() async {
    _loggedInUser = await authService.fetchUserData(_loggedInUser.id);
    notifyListeners();
  }

  Future<void> signUp(
      String firstName, String lastName, String email, String password) async {
        await authService.signUp(firstName, lastName, email, password);
  }

  Future<void> addCar(Car car) async {
    await carService.addCar(car, _loggedInUser);
    notifyListeners();
  }

  Future<void> removeCar(String plateNumber) async {
    await carService.removeCar(plateNumber, _loggedInUser);
    notifyListeners();
  }

  Future<void> logout() async {
    await authService.logout();
    _loggedInUser = null;
    notifyListeners();
  }

  Future<int> getClosestParkHouse() async {
    http.Response response = await http.get(
        '${Common.hostUri}auth/getClosestPh?userLong=${devicePosition.longitude}&userLat=${devicePosition.latitude}',
        headers: {
          'authorization': Common.authToken,
        });
    print(response.body);
    return int.parse(response.body);
  }

  Future<void> parkOut(ParkingLot parkingLot) async {
    await parkingLotService.parkOut(parkingLot);
    notifyListeners();
  }

  Future<void> parkIn(ParkingLot parkingLot, Car car) async {
    await parkingLotService.parkIn(parkingLot, car, _parkHousesProvider);
    notifyListeners();
  }

  Future<void> deleteReservation(ParkingLot parkingLot) async {
    await reservationService.deleteReservation(parkingLot, _loggedInUser);
    notifyListeners();
  }

  Future<void> makeReservation(
      ParkingLot parkingLot, User user, int duration) async {
    await reservationService.makeReservation(parkingLot, user, duration);
    notifyListeners();
  }
}
