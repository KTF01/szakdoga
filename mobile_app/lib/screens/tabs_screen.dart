import 'package:flutter/material.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:provider/provider.dart';

import '../screens/park_houses/park_houses_screen.dart';
import '../screens/user_detail/user_data_screen.dart';

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
    CommonProvider auth = Provider.of<CommonProvider>(context, listen: false);
    AppBar appBar=AppBar(
        actions: <Widget>[
          FlatButton(
            child: Icon(
              Icons.exit_to_app,
              color: Theme.of(context).accentColor,
            ),
            onPressed: () {

              auth.logout();
            },
          )
        ],
        title: Text(widget.title),
      );

    return Scaffold(
      appBar: appBar,
      body: LayoutBuilder(builder: (context, constraints) {
        if(_selectedPageIndex==0){
          return ParkHousesScreen(constraints.maxHeight);
        }else{
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
