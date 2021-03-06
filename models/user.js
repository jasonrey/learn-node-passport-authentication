var sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('users.db'),
    bcrypt = require('bcrypt');

db.run("CREATE TABLE IF NOT EXISTS 'users' ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'username' VARCHAR(255), 'password' VARCHAR(255))");

// For caching user object to prevent duplicated query unnecessarily
var userCache = {};

var User = function() {
    this.id = 0;
    this.username = '';
    this.password = '';
};

// (id, callback(Error, User))
User.findById = function(id, callback) {
    // Search if the user object has been loaded before
    if (userCache[id] !== undefined) {
        return callback(null, userCache[id]);
    }

    // If the user object has not been loaded before, we createa new instance and cache it.
    var user = new User();

    db.get("SELECT * FROM users WHERE id = " + id, function(err, row) {
        if (err) {
            return callback(err, user);
        }

        if (row === undefined) {
            return callback(new Error('No user found.'), user);
        }

        user.id = row.id;
        user.username = row.username;
        user.password = row.password;

        userCache[row.id] = user;

        callback(null, user);
    });
};

// (id, callback(Error, User))
User.findByUsername = function(username, callback) {
    db.get("SELECT * FROM users WHERE username = '" + username + "'", function(err, row) {
        if (err) {
            return callback(err);
        }

        if (row === undefined) {
            return callback(new Error('No such username.'));
        }

        // If the user object has been cached, we use the cache copy instead
        if (userCache[row.id]) {
            return callback(null, userCache[row.id]);
        }

        var user = new User();

        user.id = row.id;
        user.username = row.username;
        user.password = row.password;

        userCache[row.id] = user;

        callback(null, user);
    });
};

User.prototype.setPassword = function(password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
};

User.prototype.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

User.prototype.save = function(callback) {
    var user = this;

    if (user.id) {
        // Update

        db.run("UPDATE users SET username = ?, password = ? WHERE id = ?", user.username, user.password, user.id, callback);
    } else {
        // Insert

        db.run("INSERT INTO users (username, password) VALUES (?, ?)", user.username, user.password, function(err) {
            if (!err) {
                user.id = this.lastID;
            }

            callback && callback(err);
        });
    }
}

module.exports = User;
