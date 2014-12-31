var LocalStrategy = require('passport-local').Strategy;

// Get the user class
var User = require('../models/user');

// Create a passport class that construct according to given passport
module.exports = function(passport) {

    // To store the user data in the session
    passport.serializeUser(function(user, done) {

        // We only want to store the user id in the session
        done(null, user.id);
    });

    // To retrieve the user object from the serialized data
    passport.deserializeUser(function(id, done) {

        // Since we only store the user id in session, argument we get is naturally id
        User.findById(id, function(err, user) {
            if (err) {
                return done(err, false);
            }

            return done(null, user);
        });
    });

    // Login section

    // To name a strategy, passport.use(nameOfStrategy, new LocalStrategy)
    // Name will default to 'local' if no name is passed in

    // By default, LocalStrategy expects parameters username and password
    // To configure alternative input name, pass in an object as first parameter that defines {usernameField: '', passwordField: ''}
    passport.use(
        'local-login',
        new LocalStrategy(function(username, password, done) {
            User.findByUsername(username, function(err, user) {
                if (err) {
                    return done(err, null);
                }

                if (!user.isValidPassword(password)) {
                    return done(new Error('Incorrect password'), null);
                }

                return done(null, user);
            });
        })
    );
};
