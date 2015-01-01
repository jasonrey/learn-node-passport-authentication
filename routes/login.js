// Router that handles login process from post data
var express = require('express');
var router = express.Router();

module.exports = function(passport) {
    // By default, passport.authenticate returns a function that receives (req, res, next) that is used directly as a middleware
    // If custom callback is needed, wrap it up in a function handler by self invoking with the arguments (req, res, next)
    // When using a custom callback however, req.login needs to be called manually
    router.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
                // If there is an error, instead of redirecting, render the login page to retain the post data
            if (err) {
                req.session.message = err.message;
                return res.redirect('/login');
            }

            // If no error then we redirect to the profile page
            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }

                return res.redirect('/profile');
            });
        })(req, res, next);
    });

    return router;
};
