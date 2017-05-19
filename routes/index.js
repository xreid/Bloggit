var express = require('express');
var svgCaptcha = require('svg-captcha');
var passport = require('passport');
var csrf = require('csurf');
var mysql = require('mysql');
var dateformat = require('dateformat');
var router = express.Router();
var csrfProtection = csrf({cookie: false});
router.use(csrfProtection);


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root'
});

connection.query('USE bloggit', function (error, results, fields) {
  if (error) throw error;
});

/* GET home page. */
router.get('/', csrfProtection, function(req, res, next) {
  res.render('index', { title: 'Bloggit' });
});

router.get('/demos', function(req, res, next) {
  res.render('demos', { title: 'Bloggit', csrfToken: req.csrfToken(), user: req.user });
});

router.get('/sql-injection', function(req, res, next) {
  var captcha = svgCaptcha.createMathExpr({noise: 7});
  req.session.captcha = captcha.text;
  res.render('sql-injection', { title: 'Bloggit', captcha: captcha.data, csrfToken: req.csrfToken(), user:req.user});
});

router.post('/sql-injection', function(req, res, next) {
  var captcha = svgCaptcha.createMathExpr({noise: 7});
  req.session.captcha = captcha.text;
  console.log(req);
  var query = "Raw SQL Query: SELECT * FROM user WHERE username ='" + req.body.username + "'";
  res.render('sql-injection', { title: 'Bloggit', captcha: captcha.data, csrfToken: req.csrfToken(), query: query, user: req.user});
});

router.get('/xss', function(req, res, next) {
  var captcha = svgCaptcha.createMathExpr({noise: 7});
  req.session.captcha = captcha.text;
  res.render('xss', { title: 'Bloggit', captcha: captcha.data, csrfToken: req.csrfToken(), user:req.user});
});

router.post('/xss', function(req, res, next) {
  var captcha = svgCaptcha.createMathExpr({noise: 7});
  req.session.captcha = captcha.text;
  res.render('xss', { title: 'Bloggit', captcha: captcha.data, csrfToken: req.csrfToken(), username: req.body.username, user:req.user});
});

router.get('/defacement', function(req, res, next) {
  var captcha = svgCaptcha.createMathExpr({noise: 7});
  req.session.captcha = captcha.text;
  res.render('defacement', { title: 'HACKED HAHAHAHAHA!', captcha: captcha.data, csrfToken: req.csrfToken(), user:req.user});
});

router.post('/defacement', function(req, res, next) {
  var captcha = svgCaptcha.createMathExpr({noise: 7});
  req.session.captcha = captcha.text;
  res.render('defacement', { title: 'HACKED HAHAHAHAHA!', captcha: captcha.data, csrfToken: req.csrfToken(), user:req.user});
});

router.get('/cookies', function(req, res, next) {
  res.cookie('lastVisit', new Date(), { maxAge: 900000, httpOnly: true });
  var lastVisit = 'First time';
  if (req.cookies.lastVisit) {
    lastVisit = dateformat(req.cookies.lastVisit, "dddd, mmmm dS, yyyy h:MM:ss TT");
  }
  res.render('cookies', { title: 'Bloggit', csrfToken: req.csrfToken(), user: req.user, lastVisit: lastVisit});
});

router.post('/cookies', function(req, res, next) {
  res.clearCookie('lastVisit');
  var lastVisit = 'First time';
  if (req.cookies.lastVisit) {
    lastVisit = dateformat(req.cookies.lastVisit, "dddd, mmmm dS, yyyy h:MM:ss TT");
  }
  res.redirect('/cookies');
});

router.get('/sessions', function(req, res, next) {
  res.render('sessions', { title: 'Bloggit', csrfToken: req.csrfToken(), user: req.user });
});

router.get('/register', csrfProtection, function(req, res, next) {
  if (req.sessionID) req.logout();
  var captcha = svgCaptcha.createMathExpr({noise: 7});
  req.session.captcha = captcha.text;
  res.render('register', { title: 'Bloggit', captcha: captcha.data, csrfToken: req.csrfToken() });
});

router.post('/register', csrfProtection, passport.authenticate('local-register', {
		successRedirect : '/blogs',
		failureRedirect : '/register',
		failureFlash : true
	})
);

router.get('/login', csrfProtection, function(req, res, next) {
  if (req.sessionID) req.logout();
  var captcha = svgCaptcha.createMathExpr({noise: 7});
  req.session.captcha = captcha.text;
  res.render('login', { title: 'Bloggit', captcha: captcha.data, csrfToken: req.csrfToken() });
});

router.post('/login', csrfProtection, passport.authenticate('local-login', {
    successRedirect : '/blogs',
    failureRedirect : '/login',
    failureFlash : true
	}),
  function(req, res) {
    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
      req.session.cookie.expires = false;
    }
  res.redirect('/');
});

router.all('*', csrfProtection, function(req,res,next){
  if(req.isAuthenticated()){
    next();
  }else{
    res.redirect('/login')
  }
});

router.get('/blogs', function(req, res, next) {
  connection.query("SELECT * FROM entry", function(err, rows){
      if (err) throw err;
      res.render('blogs', { title: 'Bloggit', entries: rows.reverse(), user: req.user });
  });
});

router.get('/user', function(req, res, next) {
  connection.query("SELECT * FROM entry WHERE author=?",[req.query.username] , function(err, rows){
      if (err) throw err;
      res.render('user', { title: 'Bloggit', entries: rows.reverse(), user: req.user });
  });
});

router.get('/blog', function(req, res, next) {
  connection.query("SELECT * FROM entry WHERE id =?", [req.query.id], function(err, rows){
      if (err) throw err;
      res.render('blog', { title: 'Bloggit', entry: rows[0], user: req.user });
  });
});

router.get('/edit', csrfProtection, function(req, res, next) {
  res.render('edit', { title: 'Bloggit',  csrfToken: req.csrfToken(), user: req.user});
});

router.post('/edit', csrfProtection, function(req, res, next) {
  connection.query("INSERT INTO entry (author, title, content) VALUES (?, ?, ?)",[req.user.username, req.body.title, req.body.content], function(err, rows){
      if (err) throw err;
      console.log('New entry ' + req.body.title + ' by ' + req.user.username);
  });
  res.redirect('blogs');
});

router.get('/delete', csrfProtection, function(req, res, next) {
  connection.query("DELETE FROM entry WHERE id =?", [req.query.id], function(err, rows){
      if (err) throw err;
      res.redirect('/blogs')
  });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect(req.headers.referer);
});

module.exports = router;
