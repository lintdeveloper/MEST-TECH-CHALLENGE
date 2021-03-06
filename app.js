require('dotenv').config()
const createError = require('http-errors'),
      express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan'),
      bodyParser = require('body-parser'),
      layout = require('express-layout'),
      cloudinary = require('cloudinary'),
      methodOverride = require('method-override'),
      passport = require('passport'),
      flash = require('connect-flash'),
      session = require('express-session'),
      MongoStore = require('connect-mongo')(session), 
      /* Initialise a DB Connection */
      { mongoose } = require('./db/mongoose'),
      { ensureAuthenticated } = require('./config/auth');
      app = express();


// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 20 * 60 * 1000} //20 seconds
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

const indexRouter = require('./routes/index'),
      usersRouter = require('./routes/users'),
      housesRouter = require('./routes/houses');


/** Passport Config */
require('./config/passport')(passport)


/* Setup Cloudinary Configuration */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const port = process.env.PORT;

/* Models*/
const {House} = require('./models/house');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', "ejs");
app.use(layout());

/** Middlewares */
app.use('/public', express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

/**Routes */
app.use('/', indexRouter);
app.use('/houses/', ensureAuthenticated, housesRouter)
app.use('/', usersRouter);

app.listen(port, (req, res) => {
  console.log(`Started up on port ${port}`);
})
