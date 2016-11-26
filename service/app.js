var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongo:27017/check');
var app = express();

// Tutorial sections
var index = require('./routes/index');
// UI for testing a url lookup
var lookup = require('./routes/lookup');
// UI for data entry
var entry = require('./routes/entry');
// API for data entry
var subject = require('./routes/subject');

var pageModel = require('./page-model');
var model = pageModel(db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
    // make db available on all requests 
    req.db = db;
    next();
})
app.use(function(req,res,next){
    // make pagemodel available on all requests 
    req.model = model;
    next();
})

app.use('/', index);
app.use('/lookup', lookup);
app.use('/entry', entry);
app.use('/subjects', subject);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
