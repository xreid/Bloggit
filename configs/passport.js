var LocalStrategy   = require('passport-local').Strategy;
var mysql = require('mysql');
var md5 = require('md5');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root'
});

connection.query('USE bloggit', function (error, results, fields) {
  if (error) throw error;
});

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    connection.query("SELECT * FROM user WHERE id = ? ",[id], function(err, rows){
        done(err, rows[0]);
    });
  });

  // Used for registration
  passport.use('local-register', new LocalStrategy({ passReqToCallback: true }, function(req, username, password, done) {
    if (req.session.captcha != req.body.captcha) {
      return done(null, false, req.flash('Incorrect captcha'));
    }
    connection.query("SELECT * FROM user WHERE username = ?",[username], function(err, rows) {
      if (err)
        return done(err);
      if (rows.length) {
        return done(null, false, req.flash('signupMessage', 'Username taken.'));
      } else {
        var salt = Math.floor(Math.random() * 100000);
        var user = {username: username, salt: salt, password: md5(md5(password) + salt)};
        var insertQuery = "INSERT INTO user (username, password, salt, admin) VALUES (?, ?, ?, ?)";
        connection.query(insertQuery,[user.username, user.password, salt, 'false'],function(err, rows) {
          user.id = rows.insertId;
          return done(null, user);
        });
      }
    });
  }));

  // Used for login
  passport.use('local-login',new LocalStrategy({ passReqToCallback: true }, function(req, username, password, done) {
    if (req.session.captcha != req.body.captcha) {
      console.log(req.session.captcha + " != " + req.body.captcha);
      return done(null, false, req.flash('Incorrect captcha'));
    }
    connection.query("SELECT * FROM user WHERE username = ?",[username], function(err, rows){
      if (err) {
        console.log(err);
        return done(err);
      }
      if (!rows.length) {
        console.log('No user found');
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }
      if (md5(md5(password) + rows[0].salt) != rows[0].password) {
        console.log('Incorrect password');
        return done(null, false, req.flash('loginMessage', 'Incorrect password.'));
      }
      return done(null, rows[0]);
    });
  }));
};
