var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/passenger', function (req, res, next) {
   res.render('index', {title: 'Express'});
});

router.get('/list', function (req, res, next) {
    res.render('list', {
        title: 'List'
    });
});

router.get('/flights', function (req, res, next) {
   res.render('flights',{
       title: 'Flights'
   });
});

module.exports = router;
