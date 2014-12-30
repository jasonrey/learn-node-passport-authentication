var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// Get login page
router.get('/login', function(req, res) {
  res.render('login');
});

// Get register page
router.get('/register', function(req, res) {
  res.render('register');
});

module.exports = router;
