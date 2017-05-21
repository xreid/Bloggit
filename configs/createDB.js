var mysql = require('mysql');
var md5 = require('md5');

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

connection.query("USE bloggit", function (error, results, fields) {
  if (error) throw error;
});

var password = md5(md5('00000') + 42);
var adminQuery = "INSERT INTO user (username, password, salt, admin) VALUES ('xreid', ?, 42, true)";

connection.query(adminQuery, [password], function (error, results, fields) {
  if (error) throw error;
});

var title = "Behind the Scenes"
var content = "In order to create this website I used Node.js, Express, bulma, and AWS.\
 First I created an Amazon EC2 instance where I could host my app. Because Node \
 projects rin on port 3000 I allowed all inbound traffic on port 3000. I also \
 had to make a rule in order to connect to the instance remotely.I also used \
 git and published the project on github so I could easily track my progress \
 and work on my local machine before eventually pulling the project down to the \
 AWS instance. Once I had all of the basic functionality and security features \
 finished, I figured the website should look better than the raw html interface \
 I had. I used the CSS framework Bulma in order to make the site look nicer."

 connection.query("INSERT INTO entry (title, content, author) VALUES (?, ?, 'xreid')", [title, content], function (error, results, fields) {
   if (error) throw error;
 });

 title = "Biometric Authentication"
 content = "Biometrics are one of the newer and more interesting forms of \
 authentication. In this context, it refers to the use of a person's human \
 characteristics for authentication. One of the oldest and most common forms of \
 biometric authentication is fingerprinting. Fingerprints were used for \
 identification long before the digitial world and the continue to see use as we\
 become more technologically advanced. Other characteristics used for biometric \
 authentication include facial recognition, palm prints, speech recognition, \
 hand geometry, and iris recognition. It is possible that biometrics are better \
 than passwords and other  more widely used forms of authentication. However \
 they are not cheap and they are difficult to balance correctly. When a person \
 is wrongly rejected by the security system it is called refered to as insult, \
 and when a person is wrongly accepted, it is called fraud. The ideal biometrics \
 system has a 1:1 fraud/insult rate. Because biometrics can behard to balance \
 they are useful as a secondary system to provide extra security."

 connection.query("INSERT INTO entry (title, content, author) VALUES (?, ?, 'xreid')", [title, content], function (error, results, fields) {
   if (error) throw error;
 });

 title ="Covert Channels"
 content = "A covert channel is a communication channel that was not intended \
 to be used for communiction by the system designers. Covert channels are \
 dngerous because they provide a path for sensitive information to be secretly \
 leaked.\nExample:\Alice has top secret clearance while Bob only has confidential \
 clearance. However, in the file space shared by both top secret and confidential \
 users, Alice and Bob have agreed upon a method for communication. Each minute, \
 Bob will check to see if Alice has created a new file: 'file x'. The presence \
 of file x represents a 1, while the absence represents a 0. Bob will record \
 either a 0 or 1 each minute until the data has been transitted bit by bit. \
 Although this example is far from efficient, faster methods can be developed."

 connection.query("INSERT INTO entry (title, content, author) VALUES (?, ?, 'xreid')", [title, content], function (error, results, fields) {
   if (error) throw error;
 });

 title = "CAPTCHA's"
 content ="When you attempt to login to or registor for this site, you are \
 required to compete a simple math equation given in the form of a picture. The \
 purpose of this is to preent automated bots from logging in/registering and \
 flooding the site with requests. CAPTCHA stands for Completely Automated Public \
 Turing test to tell Computers and Humans Apart. That means this is a test created \
 and judged by computers that can distinguish computers from  humans. However, \
 with software like Computer Vision making progress, it is possible that the \
 captchas we have today will soon be obsolete."

 connection.query("INSERT INTO entry (title, content, author) VALUES (?, ?, 'xreid')", [title, content], function (error, results, fields) {
   if (error) throw error;
 });

connection.end();
