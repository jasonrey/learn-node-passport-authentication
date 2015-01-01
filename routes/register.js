// Router that handles register process from post data
var express = require('express');
var router = express.Router();

// Get the user class
var User = require('../models/user');

module.exports = function(passport) {
    router.post('/register', function(req, res, next) {
        var data = req.body,
            hasError = function(message) {
                // If there is an error, instead of redirecting, render the register page to retain the post data
                return res.render('register', {
                    message: message
                });
            }

        if (!data.username) {
            return hasError('Username required.');
        }

        if (!data.password) {
            return hasError('Password required.');
        }

        User.findByUsername(data.username, function(err) {
            // If no error, means this username already exist
            if (!err) {
                return hasError('Username exist.');
            }

            var user = new User();
            user.username = data.username;
            user.setPassword(data.password);

            user.save(function(err) {
                if (err) {
                    return hasError(err.message);
                }

                // If no error then log in automatically
                passport.authenticate('local-login', function(err, user, info) {
                    // If there is an error, set the error message in the session and redirect back to the login page
                    if (err) {
                        req.session.loginError = err.message;
                        return res.redirect('/login');
                    }

                    // If no error, then we login the user, and redirect to the profile page.
                    req.login(user, function() {
                        res.redirect('/profile');
                    });
                })(req, res, next);
            });
        })
    });

    return router;
};
