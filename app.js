var express = require('express'),
  passport = require('passport'),
  util = require('util'),
  TwitterStrategy = require('passport-twitter').Strategy;

var mongodb = require('mongodb');
var mongoose = require('mongoose');

var http = require('http');
var https = require('https');



var TWITTER_CONSUMER_KEY = "0GOReNaXWXCTpf7OQgrg";
var TWITTER_CONSUMER_SECRET = "0wA8yUBrXz3ivpTHcuBbKp3vGN2ODnOF7iFM9DB48Y";
var TWITTER_CALLBACK_URL = "http://127.0.0.1:8888/auth/twitter/callback";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Twitter profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  console.log("SERIALIZE: ", user.id);
  //TODO Serialize user.id
  done(null, user.id);
});

passport.deserializeUser(function(obj, done) {
  var User = mongoose.model('User');
  User.findOne({_id: obj}, function(err, foundUser){
    if(err){
      return done(err);
    }
    console.log("DESERIALIZE: ", foundUser);
    done(null, foundUser);
  });
});


// Use the TwitterStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Twitter profile), and
//   invoke a callback with a user object.
passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: TWITTER_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    function sanitizeImgURL(string){
      return string.replace("_normal", "");
    }

    console.log("profile: ", profile);
    process.nextTick(function(){
      var User = mongoose.model('User');
      User.findOne({twitter_id: profile.id}, function(err, foundUser){
        if(err){
          return done(err);
        }
        if(foundUser){
          console.log("FOUND THE USER++++++++++++++++++++++++");
          return done(null, foundUser);
        }
        console.log("NEW PROF ID", profile.id);
        var newUser = new User({
          twitter_id: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          email: profile.email,
          imageUrl: sanitizeImgURL(profile._json.profile_image_url)
        });
        newUser.save(function(err){
          if(err){
            console.log("ERROR - Cannot save new user");
          }
        });
        return done(null, newUser);
      });
    });
  })
);




var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({
    secret: 'keyboard cat',
    maxAge: new Date(Date.now() + 3600000), //1 Hour
    expires: new Date(Date.now() + 3600000) //1 Hour
  }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

var wayo = require('./wayo');
var routes = require('./routes/routes')(app, wayo);
var user = require('./models/user');
var group = require('./models/group');
var song = require('./models/song');
var album = require('./models/album');
var activity_item = require('./models/activity_item');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connected to DB');
});




app.get('/', function(req, res){
	console.log(req.user);
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
	console.log(req.user);
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
	console.log(req.user);
  res.render('login', { user: req.user });
});

// GET /auth/twitter
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Twitter authentication will involve redirecting
//   the user to twitter.com.  After authorization, the Twitter will redirect
//   the user back to this application at /auth/twitter/callback
app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  });

// GET /auth/twitter/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/static/login.html' }),
  function(req, res) {
    res.redirect('/static/index.html');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/static/index.html');
});

app.listen(8888);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}