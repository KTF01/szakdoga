import 'package:flutter/material.dart';
import 'package:mobile_app/models/providers/common_provider.dart';
import 'package:provider/provider.dart';

enum AuthMode { Signup, Login }

class AuthScreen extends StatelessWidget {
  static const routeName = '/auth';

  @override
  Widget build(BuildContext context) {
    final deviceSize = MediaQuery.of(context).size;
    return Scaffold(
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).requestFocus(new FocusNode());
        },
        child: Stack(
          children: <Widget>[
            Container(
              decoration: BoxDecoration(color: Theme.of(context).primaryColor),
            ),
            SingleChildScrollView(
              child: Container(
                height: deviceSize.height,
                width: deviceSize.width,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                    Flexible(
                      flex: deviceSize.width > 600 ? 2 : 1,
                      child: AuthCard(),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class AuthCard extends StatefulWidget {
  const AuthCard({
    Key key,
  }) : super(key: key);

  @override
  _AuthCardState createState() => _AuthCardState();
}

class _AuthCardState extends State<AuthCard> {
  final GlobalKey<FormState> _formKey = GlobalKey();
  AuthMode _authMode = AuthMode.Login;
  Map<String, String> _authInfo = {
    'email': '',
    'firstName': '',
    'lastName': '',
    'password': '',
  };
  var _isLoading = false;
  final _passwordController = TextEditingController();

  void _submit() async {
    FocusScope.of(context).requestFocus(new FocusNode());
    if (!_formKey.currentState.validate()) {
      return;
    }
    _formKey.currentState.save();
    setState(() {
      _isLoading = true;
    });
    CommonProvider commonProvider = Provider.of<CommonProvider>(context, listen: false);
    if (_authMode == AuthMode.Login) {
      try {
        await commonProvider.manualLogIn(_authInfo['email'], _authInfo['password']);
      } catch (error) {
        _showErrorDialog(error.toString());
      }
    } else {
      try {
        await commonProvider.signUp(_authInfo['firstName'], _authInfo['lastName'],
            _authInfo['email'], _authInfo['password']);
        _switchAuthMode();
      } catch (error) {
        _showErrorDialog(error.toString());
      }
    }
    setState(() {
      _isLoading = false;
    });
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        content: Text(
          message,
          style: TextStyle(color: Theme.of(context).errorColor),
        ),
        actions: <Widget>[
          RaisedButton(
            child: Text("Ok"),
            onPressed: () {
              Navigator.pop(context);
            },
          )
        ],
      ),
    );
  }

  void _switchAuthMode() {
    if (_authMode == AuthMode.Login) {
      setState(() {
        _authMode = AuthMode.Signup;
      });
    } else {
      setState(() {
        _authMode = AuthMode.Login;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final deviceSize = MediaQuery.of(context).size;
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(5.0),
      ),
      elevation: 5.0,
      child: Container(
        height: _authMode == AuthMode.Signup ? 450 : 280,
        constraints:
            BoxConstraints(minHeight: _authMode == AuthMode.Signup ? 320 : 260),
        width: deviceSize.width * 0.75,
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              children: <Widget>[
                TextFormField(
                  decoration: InputDecoration(labelText: 'E-Mail'),
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) {
                    if (value.isEmpty) {
                      return "Nem lehet üres!";
                    }
                    if (!value.contains('@') || !value.contains('.')) {
                      return "Helyetlen email!";
                    }
                  },
                  onSaved: (value) {
                    _authInfo['email'] = value;
                  },
                ),
                if (_authMode == AuthMode.Signup)
                  TextFormField(
                    decoration: InputDecoration(labelText: 'Vezetéknév'),
                    validator: (String value) {
                      if (value.isEmpty) {
                        return 'Nem lehet üres!';
                      }
                    },
                    onSaved: (value) {
                      _authInfo['firstName'] = value;
                    },
                  ),
                if (_authMode == AuthMode.Signup)
                  TextFormField(
                    decoration: InputDecoration(labelText: 'Keresztnév'),
                    validator: (String value) {
                      if (value.isEmpty) {
                        return 'Nem lehet üress';
                      }
                    },
                    onSaved: (value) {
                      _authInfo['lastName'] = value;
                    },
                  ),
                TextFormField(
                  decoration: InputDecoration(labelText: 'Jelszó'),
                  obscureText: true,
                  controller: _passwordController,
                  validator: (value) {
                    if (value.isEmpty || value.length < 6) {
                      return 'A jelszónak minimum 6 karakternek kell lennie';
                    }
                  },
                  onSaved: (value) {
                    _authInfo['password'] = value;
                  },
                ),
                if (_authMode == AuthMode.Signup)
                  TextFormField(
                    enabled: _authMode == AuthMode.Signup,
                    decoration: InputDecoration(labelText: 'Jelszó ismét'),
                    obscureText: true,
                    validator: _authMode == AuthMode.Signup
                        ? (value) {
                            if (value != _passwordController.text) {
                              return 'A jelszavak nem egyeznek!';
                            }
                          }
                        : null,
                  ),
                SizedBox(
                  height: 20,
                ),
                if (_isLoading)
                  CircularProgressIndicator(
                    backgroundColor: Theme.of(context).primaryColor,
                  )
                else
                  RaisedButton(
                    child: Text(_authMode == AuthMode.Login
                        ? 'Belépés'
                        : 'Regisztráció'),
                    onPressed: _submit,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    padding:
                        EdgeInsets.symmetric(horizontal: 30.0, vertical: 8.0),
                    color: Theme.of(context).primaryColor,
                    textColor: Theme.of(context).primaryTextTheme.button.color,
                  ),
                FlatButton(
                  child: Text(
                      '${_authMode == AuthMode.Login ? 'Regisztráció' : 'Bejelentkezés'}'),
                  onPressed: _switchAuthMode,
                  padding: EdgeInsets.symmetric(horizontal: 30.0, vertical: 4),
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  textColor: Theme.of(context).primaryColor,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
