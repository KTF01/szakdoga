import 'package:flutter/material.dart';
import 'package:mobile_app/models/Sector.dart';
import 'package:mobile_app/parking_lot_list.dart';

class SectorListElem extends StatefulWidget {
  final Sector sector;

  SectorListElem(this.sector);
  @override
  _SectorListElemState createState() => _SectorListElemState();
}

class _SectorListElemState extends State<SectorListElem> {

  double plListheight = 0;

  void toggleExpand(BuildContext ctx) {
    setState(() {
      if(plListheight==0)
      plListheight=MediaQuery.of(ctx).size.height*0.4;
      else plListheight=0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: <Widget>[
          Container(
            child: InkWell(
              onTap:()=> toggleExpand(context),
              highlightColor: Theme.of(context).primaryColorLight,
              child: ListTile(
                title: Text(widget.sector.name),
                subtitle: Text(
                  "Szabad helyek: " + widget.sector.freePlCount.toString(),
                ),
                trailing: Icon(Icons.arrow_drop_down),
              ),
            ),
          ),
          Container(
            margin: EdgeInsets.symmetric(horizontal: 5, vertical: 0),
            width: double.infinity,
            height: plListheight,
            child: ParkingLotList(widget.sector.parkingLots),
          ),
        ],
      ),
    );
  }
}
