import 'package:flutter/material.dart';

import 'screens/park_houses/park_houses_screen.dart';
import 'screens/user_data_screen.dart';

class TabsScreen extends StatefulWidget {
  final String title;

  static const String routeName = 'tapsScreen';

  TabsScreen(this.title);
  @override
  _TabsScreenState createState() => _TabsScreenState();
}

class _TabsScreenState extends State<TabsScreen> {
  
  final List<Widget> _screens = [
    ParkHousesScreen(),
    UserData(),
  ];

  int _selectedPageIndex = 0;


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: _screens[_selectedPageIndex],
      bottomNavigationBar: BottomNavigationBar(
        onTap: (int indexOfTab){
          setState(() {
            _selectedPageIndex =indexOfTab;
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
