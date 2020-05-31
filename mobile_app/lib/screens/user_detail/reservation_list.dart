import 'package:date_format/date_format.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app/common/sure_dialog.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:mobile_app/models/reservation.dart';
import 'package:provider/provider.dart';

/**
 * A felhaználó foglalásait megjelenítő felület.
 */
class ReservationList extends StatefulWidget {
  final List<Reservation> reservations;
  ReservationList(this.reservations);
  @override
  _ReservationListState createState() => _ReservationListState();
}

class _ReservationListState extends State<ReservationList> {
  @override
  Widget build(BuildContext context) {
    CommonProvider authManager = Provider.of<CommonProvider>(context);
    return Container(
      height: 200,
      child: ListView(
        children: widget.reservations.map((res) {
          return ListTile(
            title: Text(
                '${res.parkingLot.sector.parkHouse.name}/${res.parkingLot.sector.name}/${res.parkingLot.name}'),
            subtitle: Text(
              'Foglalás vége: ' +
                  formatDate(
                    res.endTime.toLocal(),
                    [yyyy, "-", mm, "-", dd, " ", HH, ":", nn],//Formázzuk az időt
                  ),
            ),
            trailing: RaisedButton(
              color: Theme.of(context).primaryColor,
              textColor: Theme.of(context).primaryTextTheme.button.color,
              child: Text("Lemondás"),
              onPressed: () {
                showDialog( //Popup
                    context: context,
                    builder: (BuildContext context) {
                      return SureDialog(
                        text: "Biztos lemondja a foglalását?",
                        okText: "Igen",
                        noText: "Nem",
                        okAction: () async {
                          await authManager.deleteReservation(res.parkingLot);
                          setState(() {
                            widget.reservations.remove(res);
                          });
                        },
                      );
                    });
              },
            ),
          );
        }).toList(),
      ),
    );
  }
}
