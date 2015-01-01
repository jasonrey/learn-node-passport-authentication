var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// Get login page
router.get('/login', function(req, res) {
  var message = req.session.message;
  req.session.message = null;

  res.render('login', {
    message: message
  });
});

// Get register page
router.get('/register', function(req, res) {
  var message = req.session.message;
  req.session.message = null;

  res.render('register', {
    message: message
  });
});

// Get profile page
router.get('/profile', function(req, res) {
  // If no user is in the session, then we redirect out to login page
  if (req.user === undefined || !req.user) {
    req.session.message = 'Not logged in.';
    return res.redirect('/login');
  }

  res.render('profile', {
    user: req.user
  });
});

module.exports = router;
