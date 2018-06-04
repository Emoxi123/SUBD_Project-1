var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const mysql = require('mysql');

//Create connection
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password  : '12345',
    database : 'nodemysql'
});

// Connect
db.connect(function(err) {
    if (err) throw err;
    console.log("MySql connected ...");
});

// Create DATABASE
var app = express();
app.use('/createdb', function(req, res) {

  var sql = "CREATE DATABASE nodemysql";

  db.query(sql, function (err, result) {
    if(err) throw err;
    conosole.log(result);
    res.send("Database created");
  })
});

// Create TABLE
app.use('/createtable', function (req, res) {

    var sql = "CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(250), body VARCHAR(250), PRIMARY KEY (id))";
    db.query(sql, function (err, result) {
        if(err) throw err;
        console.log(result);
        res.send("CREATED TABLE posts");
    })
});

// Insert VALUES
app.use('/addpost', function (req, res) {

  var post =  {title: "Post One", body: "This is example"};
  var sql = "INSERT INTO posts SET ?";

  db.query(sql, post, function (err, result) {
      if(err) throw err;
      console.log(result);
      res.send("Post Added");
  })
});

// Select VALUES
app.use('/getposts', function (req, res) {

    var sql = "SELECT * FROM posts";

    db.query(sql, function (err, results) {
        if(err) throw err;
        console.log(results);
        res.send("SELECT * FROM posts");
    })
});

// Select single post
app.use('/getpost/:id', function (req, res) {

   //Template literal
    var sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;

    db.query(sql, function (err, results) {
        if(err) throw err;
        console.log(results);
        res.send("Post fetched ...");
    })
});

//UPDATE post
app.use('/updatepost/:id', function (req, res) {
    var newTitle = "UpdatedTitle";

    //Template literal
    var sql = `UPDATE posts
               SET title = '${newTitle}'
               WHERE id = ${req.params.id}`;

    db.query(sql, function (err, result) {
        if(err) throw err;
        console.log(result);
        res.send("Post updated successfully");
    })
});

//DELETE post
app.use('/deletepost/:id', function (req, res) {
    //Template literal
    var sql = `DELETE FROM posts WHERE id = ${req.params.id}`;

    db.query(sql, function (err, result) {
        if(err) throw err;
        console.log(result);
        res.send(`Post ${req.params.id} successfully deleted`);
    })
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
