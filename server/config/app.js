/* Packages */

/* General dependencies */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* Authentication */
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

// Setup User model
let userModel = require('../models/user');
let User = userModel.User;

/* MongoDB / Mongoose */
let DB = require('./db');
let mongoose = require('mongoose');
let mongoDB = mongoose.connection;

// Express
var app = express();

//mongoose.connect('mongodb://127.0.0.1:27017/BookLib');
mongoose.connect(DB.URI);
mongoDB.on('error', console.error.bind(console, 'Connection Error'));
mongoDB.once('open', () => { console.log("3. MongoDB is connected") });

// Session setup
app.use(session({
  secret:"SomeSecret",
  saveUninitialized:false,
  resave:false
}));

// Flash setup
app.use(flash());

// Setup user authentication strategy
passport.use(User.createStrategy());

// Authentication -- Passport setup
app.use(passport.initialize());
app.use(passport.session());

// User info serialization/deserialization
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Routers
let indexRouter = require('../routes/index');
let assignmentRouter = require('../routes/assignment');

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));

app.use('/', indexRouter);
app.use('/list', assignmentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
