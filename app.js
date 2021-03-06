var express 		= require('express');
var path 			= require('path');
var favicon 		= require('serve-favicon');
var logger 			= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var colors			= require('colors');
Promise 			= require('promise');
var Twig			= require('twig');

// Global
Config				= require('./config.app.js');
Log 				= require('./helpers/log.js');
error 				= require('./helpers/error.js');
Token				= require('./helpers/tokens.js');
Tools				= require('./helpers/tools.js');

// Routes
var routes 			= require('./routes/1.0/index');
var users 			= require('./routes/1.0/users');

var app = express();

Log.i("Launching API...");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.set('port', Config.PORT);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (Config.MODE === 'dev')
  app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

Log.i("Initialize routes...");
app.use('/', routes);
app.use('/api/1.0/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (Config.MODE == 'dev') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// MongoDB
DB = null;
Log.i('MongoDB connection');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(Config.MONGO_ADDR, function(err, db) {
	if(!err) {
		Log.i('We are connected');
		Log.i('API is ready to used');
		DB = db;
	}
	else {
		Log.e('Failed to connect MongoDB');
	}
});


module.exports = app;
