import 'package:flutter/material.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:provider/provider.dart';

import '../screens/park_houses/park_houses_screen.dart';
import '../screens/user_detail/user_data_screen.dart';

/**
 * Alsó csíkon lévő navigácót elősegítő widget.
 */

class TabsScreen extends StatefulWidget {
  final String title;

  static const String routeName = 'tapsScreen';

  TabsScreen(this.title);
  @override
  _TabsScreenState createState() => _TabsScreenState();
}

class _TabsScreenState extends State<TabsScreen> {

  int _selectedPageIndex = 0;

  @override
  Widget build(BuildContext context) {
    //Feliratkozás a providerre.
    CommonProvider commonProvider = Provider.of<CommonProvider>(context, listen: false);
    AppBar appBar=AppBar(
        actions: <Widget>[
          FlatButton(
            child: Icon(
              Icons.exit_to_app,
              color: Theme.of(context).accentColor,
            ),
            onPressed: () {

              commonProvider.logout();
            },
          )
        ],
        title: Text(widget.title),
      );

    return Scaffold(
      appBar: appBar,
      body: LayoutBuilder(builder: (context, constraints) {//Layoutbuilderrrel dinamikusan lehet widgeteket buildelni.
        if(_selectedPageIndex==0){//Ha 0-s a selectedPageIndex akkor a ParkHousesScreen-t jelenítjük meg
          return ParkHousesScreen(constraints.maxHeight);
        }else{//Ha 1-es a selectedPageIndex akkor a UserData-t jelenítjük meg
          return UserData(constraints.maxHeight);
        }
      },),
      bottomNavigationBar: BottomNavigationBar(
        onTap: (int indexOfTab) {
          setState(() {
            _selectedPageIndex = indexOfTab;
          });
        },
        backgroundColor: Theme.of(context).primaryColor,
        unselectedItemColor: Theme.of(context).primaryColorLight,
        selectedItemColor: Theme.of(context).accentColor,
        currentIndex: _selectedPageIndex,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            title: Text('Parkházak'),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            title: Text('Saját adatok'),
          ),
        ],
      ),
    );
  }
}
