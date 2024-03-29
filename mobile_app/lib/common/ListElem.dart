import 'package:flutter/material.dart';

/**
 * Általános listaelemet kirajzoló widget.
 */

class ListElem extends StatefulWidget {
  final String title;
  final String subtitle;
  final Widget trailing;
  final Function clickEvent;

  ListElem({this.title, this.subtitle, this.trailing, this.clickEvent});
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
        highlightColor: Theme.of(context).primaryColorLight,
        child: ListTile(
          title: Text(widget.title),
          subtitle: Text(
            widget.subtitle,
          ),
          trailing: widget.trailing,
        ),
      ),
    );
  }
}
