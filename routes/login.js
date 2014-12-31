// Router that handles login process from post data

module.exports = function(app, passport) {
    app.post(
        '/login',
        function(req, res, next) {
            passport.authenticate('local-login', function(err, user, info) {
                // If there is an error, set the error message in the session and redirect back to the login page
                if (err) {
                    req.session.loginError = err.message;
                    return res.redirect('/login');
                }

                // If no error then we redirect to the profile page
                return res.redirect('/profile');
            })(req, res, next);
        }
    );
}
