var express = require('express');
var app = express();
var expressValidator = require('express-validator');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
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

    var sql = "CREATE TABLE passengers(id int AUTO_INCREMENT NOT NULL" +
        ", passengerName VARCHAR(30), city VARCHAR(60), dateFlight VARCHAR(20)" +
        ", flightNumber int, PRIMARY KEY (id))";

    db.query(sql, function (err, result) {
        if(err) throw err;
        console.log(result);
        res.send("CREATED TABLE passengers");
    })
});
app.use('/createtable1', function (req, res) {
    var sql = "CREATE TABLE flights(id int AUTO_INCREMENT NOT NULL" +
        ",  flightNumber int, originCity VARCHAR(60), destinationCity VARCHAR(60)" +
        ", countPassengers int, price int, dateFlight VARCHAR(20)" +
        ", PRIMARY KEY (id))";
    db.query(sql, function (err, result) {
        if(err) throw err;
        console.log(result);
        res.send("CREATED TABLE flights");
    })
});


app.get('/', function (req, res) {
    var passenger =  [
        {
            passengerName: "Jack",
            city: "Sofia",
            dateFlight: req.body.flightDate,
            flightNumber: req.body.flightNum,
        },
        {
            passengerName: "Ally",
                city: "Avga",
            dateFlight: req.body.flightDate,
            flightNumber: req.body.flightNum,
        },
        {
            passengerName: req.body.pgrName,
                city: req.body.bornCity,
            dateFlight: req.body.flightDate,
            flightNumber: req.body.flightNum,
        }
    ];
    res.render('index', {
       pass: passenger
    });
});
// Insert VALUES
app.use('/addpassenger', function (req, res) {

    var passenger =  {
        passengerName: req.body.pgrName,
        city: req.body.bornCity,
        dateFlight: req.body.flightDate,
        flightNumber: req.body.flightNum
    };

    var sql = "INSERT INTO passengers SET ?";

    db.query(sql, passenger, function (err, result) {
        if(err) throw err;
        console.log(result);
        res.send("Passenger successfully added.");
    })
});

var data;
// Select VALUES
app.use('/getpassengers', function (req, res) {

    var sql = "SELECT * FROM passengers";
    db.query(sql, function (err, results) {
        if(err) throw err;

        if(res.length > 0)
            data = res;
        else
            data = null;

        console.log(results);
        res.send("SELECT * FROM passengers");
    })
});

// Select single post
app.use('/getpassenger/:id', function (req, res) {

    //Template literal
    var sql = `SELECT * FROM passengers WHERE id = ${req.params.id}`;

    db.query(sql, function (err, results) {
        if(err) throw err;
        console.log(results);
        res.send("Passenger fetched ...");
    })
});

//UPDATE post
app.use('/updatepassenger/:id', function (req, res) {
    var newName = "NewName";

    //Template literal
    var sql = `UPDATE passengers
               SET passengerName = '${newName}'
               WHERE id = ${req.params.id}`;

    db.query(sql, function (err, result) {
        if(err) throw err;
        console.log(result);
        res.send("Passenger info updated successfully");
    })
});

//DELETE post
app.use('/deletepassenger/:id', function (req, res) {
    //Template literal
    var sql = `DELETE FROM passengers WHERE id = ${req.params.id}`;

    db.query(sql, function (err, result) {
        if(err) throw err;
        console.log(result);
        res.send(`Passenger ${req.params.id} successfully deleted`);
    })
});

module.exports = app;