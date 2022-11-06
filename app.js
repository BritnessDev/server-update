if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
// const expressPartials = require('express-partials');


// var mongoose = require("mongoose")
// mongoose.connect("mongodb+srv://Sameed1990:031310937791990@cluster0.sviblbj.mongodb.net/ecommerce") , {useNewUrlParser: true, useCreateIndex: true}


/*  ---------------------------------------------  */
/*                     MongoDB                     */
/*  ---------------------------------------------  */
const mongoose = require('mongoose');
mongoose.connect( process.env.db_url )
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => {
    console.log('Connected to MongoDB')
    // console.log('process.env.DATABASE_URL ' + process.env.DATABASE_URL)
})




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static((__dirname + 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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