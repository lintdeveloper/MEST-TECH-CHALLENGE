require('dotenv').config()
const createError = require('http-errors'),
      express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan'),
      bodyParser = require('body-parser'),
      layout = require('express-layout'),
      cloudinary = require('cloudinary');
      app = express();

const indexRouter = require('./routes/index'),
      usersRouter = require('./routes/users'),
      housesRouter = require('./routes/houses');

/* Setup Cloudinary Configuration */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

/* Models*/
const {House} = require('./models/house'),

/* Initialise a DB Connection */
    {mongoose} = require('./db/mongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', "ejs");

/** Middlewares */
app.use('/public', express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(layout());

/**Routes */
app.use('/', indexRouter);
app.use('/houses', housesRouter)
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
