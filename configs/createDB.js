var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root'
});

connection.query('DROP DATABASE IF EXISTS bloggit', function (error, results, fields) {
  if (error) throw error;
});

connection.query('CREATE DATABASE bloggit', function (error, results, fields) {
  if (error) throw error;
});

connection.query('USE bloggit', function (error, results, fields) {
  if (error) throw error;
});

var userQuery = 'CREATE TABLE user (id INT NOT NULL AUTO_INCREMENT, username VARCHAR(20), password VARCHAR(80), salt INT, admin BOOL,  PRIMARY KEY (id))';
var entryQuery = 'CREATE TABLE entry (id INT NOT NULL AUTO_INCREMENT, author VARCHAR(20), title VARCHAR(80), content TEXT, PRIMARY KEY (id))';

connection.query(userQuery, function (error, results, fields) {
  if (error) throw error;
});

connection.query(entryQuery, function (error, results, fields) {
  if (error) throw error;
});

connection.end();
