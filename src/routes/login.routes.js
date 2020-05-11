var express = require('express');
var app = express();

var mAuth = require('../middleware/auth.middleware');

var loginController = require('../controllers/login.controller');

/**
 * Login
 */
app.route('/').post(loginController.loginWithEmail);
app.route('/google').post(loginController.loginWithGoogle);

app.route('/verify').get(mAuth.verifyToken, (req, res) => {
  return res.status(200).json({ user: req.authUser });
});
module.exports = app;
