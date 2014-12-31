var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// Get login page
router.get('/login', function(req, res) {
  var message = null;

  // If there is a login error, set the message then clear it because we only want this once
  if (req.session.loginError !== undefined) {
    message = req.session.loginError;
    req.session.loginError = undefined;
  }
  res.render('login', {
    message: message
  });
});

// Get register page
router.get('/register', function(req, res) {
  res.render('register');
});

module.exports = router;
