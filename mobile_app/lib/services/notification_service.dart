import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:mobile_app/models/parkingLot.dart';

class NotificationService {
  static FlutterLocalNotificationsPlugin notificationsPlugin =
      FlutterLocalNotificationsPlugin();

  static Future<void> initNotification() async {
    AndroidInitializationSettings androidInitializationSettings =
        new AndroidInitializationSettings('ic_launcher');
    IOSInitializationSettings initializationSettingsIOS =
        IOSInitializationSettings();
    InitializationSettings initializationSettings = InitializationSettings(
        androidInitializationSettings, initializationSettingsIOS);
    await notificationsPlugin.initialize(initializationSettings);
  }

  static Future<void> setupNotification(int id, ParkingLot parkingLot) async {
    DateTime scheduledTime = DateTime.now().add(Duration(hours: 10));
    final btsi = BigTextStyleInformation(
        'Már régóta bent áll a(z) <h1>${parkingLot.sector.parkHouse.name}:${parkingLot.sector.name}/${parkingLot.name}</h1> parkolóban. \nNem felejtett el kiállni?',
        htmlFormatBigText: true);
    AndroidNotificationDetails androidNotificationDetails =
        AndroidNotificationDetails('0', 'teszt-chanel', 'eleg jo',
            styleInformation: btsi);
    IOSNotificationDetails iosNotificationDetails = IOSNotificationDetails();
    NotificationDetails notificationDetails =
        NotificationDetails(androidNotificationDetails, iosNotificationDetails);
    Time dailyTime =
        Time(scheduledTime.hour, scheduledTime.minute, scheduledTime.second);
    await notificationsPlugin.cancel(id);
    await notificationsPlugin.showDailyAtTime(
        id,
        'Kiparkolás ${parkingLot.occupyingCar.plateNumber}',
        'Mindegy',
        dailyTime,
        notificationDetails);
  }
}
