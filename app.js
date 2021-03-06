const express = require('express');
const session = require('express-session');
const MSSQLStore = require('connect-mssql')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./services/passport');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const helpers = require('./helpers');
const errorHandlers = require('./middlewares/errorHandlers')
const keys = require('./config/keys');

// ROUTES
const routes = require('./routes/index');
const authRoutes = require('./routes/auth/authRoutes');
const testRoutes = require('./routes/test/testRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
const adminApiRoutes = require('./routes/admin/api');
const sysselRoutes = require('./routes/syssel/sysselRoutes');
const sysselApiRoutes = require('./routes/syssel/api');
const entarchRoutes = require('./routes/entarch/entarchRoutes');
const entarchApiRoutes = require('./routes/entarch/api');
const optimumRoutes = require('./routes/optimum/optimumRoutes');
const optimumApiRoutes = require('./routes/optimum/api');
const journeyRoutes = require('./routes/busjour/journeyRoutes');
const journeyApiRoutes = require('./routes/busjour/api');

// create the Express app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// serve up static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Convert raw requests into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// validate data
app.use(expressValidator());

// populate req.cookies with any cookies that come along with the request
app.use(cookieParser());
app.use(
    cookieSession({
        maxAge: 30*24*60*60*1000,
        keys: [keys.cookieKey]
    })
);

// sessions allow us to store data on visitors from request to request
// keeps users logged in and allows to send flash messages
const sessionConfig = {
    user: keys.sqlServer['userName'],
    password: keys.sqlServer['password'],
    server: keys.sqlServer['server'],
    database: keys.sqlServer['database'],
    options: {
        encrypt: true
    }
}
app.use(session({
    secret: process.env.cookieSecret || keys.cookieSecret,
    key: process.env.cookieKey || keys.cookieKey,
    resave: false,
    saveUninitialized: false,
    store: new MSSQLStore(sessionConfig)
}));

// Passport JS
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());

// pass variables to templates and all requests
app.use((req, res, next) => {
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
    req.login = promisify(req.login, req);
    next();
});


// Route handling
app.use('/', routes);
app.use('/test', testRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/admin', adminApiRoutes);
app.use('/syssel', sysselRoutes);
app.use('/api/syssel', sysselApiRoutes);
app.use('/entarch', entarchRoutes);
app.use('/api/entarch', entarchApiRoutes);
app.use('/optimum', optimumRoutes);
app.use('/api/optimum', optimumApiRoutes);
app.use('/journey', journeyRoutes);
app.use('/api/journey', journeyApiRoutes);


// If above routes don't work, 404 and forward to error handler
app.use(errorHandlers.notFound);

// one of the error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// otherwise fatal error
if (app.get('env') === 'development') {
    app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// export so that can start site in start.js
module.exports = app;