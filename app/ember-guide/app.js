// Application file
// set up =================================================
var fs              = require('fs'); // Filesystem
var express         = require('express'); // express
var session         = require('express-session'); // sessions
var app             = express(); // instantiate express
var port            = process.env.PORT || 3000; //Service listening here
var mongoose        = require('mongoose'); //Mongodb ORM
var RedisStore      = require('connect-redis')(session); // Redis for persistent sessions
var passport        = require('passport'); // Passport for federated login
var flash           = require('connect-flash'); // Pass messages in the request
var middleware      = require('./app/routes/middleware') // Custom Middleware
var morgan          = require('morgan'); // Logging
var cookieParser    = require('cookie-parser'); //Parse cookie data
var bodyParser      = require('body-parser'); //parse body data
var csrf            = require('csurf');//Prevent CSRF in forms
var validator       = require('express-validator'); //Validate forms
var _               = require('underscore'); //JS utility library

//globals are bad, mmkay? =================================
global.appGlobals   = {};
appGlobals.config   = require('./config')(app.get('env'));
appGlobals.logger   =  require('./app/services/logger');

// mongoose ===============================================
mongoose.connect(appGlobals.config.get('database').url);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error: '));
conn.once('open', function(){
    appGlobals.logger.info('connected to mongodb');
});

//models ==================================================
var models = require('./app/models')();

// pass passport for configuration ========================
require('./app/services/passport')(passport, models.User);

// set us up express ======================================
//logging
var logFormat = {
    format: appGlobals.config.get("logger").format,
    stream: fs.createWriteStream(
        appGlobals.config.get("logger").expressFilename,
        {'flags': 'w'}
    )//write to file
}
app.use(morgan(logFormat));

//express middleware ======================================
app.use(cookieParser()); // read cookies
app.use(bodyParser()); // read HTTP posts
app.use(validator())
app.set('view engine', 'ejs'); // templating
// integrate with passport
app.use(session({
    secret: 'keyboardcatmeow',
    maxAge: new Date(Date.now() + 3600000),
    store: new RedisStore()
}));
app.use(passport.initialize());

// persistent login sessions
app.use(passport.session());

// use connect-flash for flash messages in the session
app.use(flash());
app.use(middleware.flashAlert);
app.use(middleware.flashForm);
app.use(middleware.flashBody);

//Serve static files
app.use(express.static('public', {maxAge: 86400000}));

//csrf protection
app.use(csrf());
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    }

    // handle CSRF token errors here
    res.status(403)
    res.send('session has expired or form tampered with')
});

// routes =================================================
//get the routes object as an array of routes
var routes = require('./app/routes')(express, passport);
app.use('/', routes.public);
app.use('/', routes.passport);
app.use('/', routes.protected);

//catch errors ============================================
function logErrors(err, req, res, next)  {
    appGlobals.logger.error(err.stack);
    next(err);
}
function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}
app.use(logErrors);
app.use(errorHandler);

// start the app ==========================================
app.listen(port);
appGlobals.logger.info('Starting app on port ' + port);
appGlobals.logger.info('NODE_ENV: ', app.get('env'));
