import 'package:flutter/material.dart';

class ListElem extends StatefulWidget {
  final String title;
  final String subtitle;
  final String trailing;
  final Function clickEvent;

  ListElem({this.title, this.subtitle, this.trailing='', this.clickEvent});
  @override
  _ListElemState createState() => _ListElemState();
}

class _ListElemState extends State<ListElem> {
  Color bgColor = Colors.white;
  @override
  Widget build(BuildContext context) {
    return Card(
      color: bgColor,
      child: InkWell(
        onTap: widget.clickEvent,
        highlightColor:Theme.of(context).primaryColorLight,
        child: ListTile(
          title: Text(widget.title),
          subtitle: Text(widget.subtitle),
          trailing: Text(
            'Szabad helyek: ${widget.trailing}',
          ),
        ),
      ),
    );
  }
}
