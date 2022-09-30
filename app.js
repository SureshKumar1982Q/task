
require('dotenv').config();  
require('./Models/MongoDB/DB');                                    /// Connect to Mongo DB
                                      /// Get the .env file
const express         =     require('express')                     //// Express module
  , passport          =     require('passport')                   ///// Passport for facebook,google
  , FacebookStrategy  =     require('passport-facebook').Strategy  ////// Facebook strategy
  , session           =     require('express-session')             ////// Express session
  , cookieParser      =     require('cookie-parser')                ////// Parse the cookie
  , bodyParser        =     require('body-parser')                  ////// Parse the incoming data
  , config            =     require('./configuration/config')       ////// Facebook,google config
  ,fs                 =     require('fs')                           ////// File system
  ,docxConverter       =    require('docx-pdf')                     ////// Word to pdf converter library
  ,path               =     require('path')                         ////// Path moduke
  , app               =     express();

  const MongoOneToOneDBRoutes = require('./Routes/MongoOntToOneDBRoutes')  /// Routes file
  const MongoOneToManyDBRoutes = require('./Routes/MongoOneToManyRoutes')  /// Routes file

  const port = process.env.port || 3000;


  app.set('views', __dirname + '/views');                         ////// Set the view engine template directory
  app.set('view engine', 'ejs');                                  ////// set ejs as view engine 
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }))             ///// encode the incoming body url data

  // parse application/json 
  app.use(bodyParser.json())                                         
   
  app.use(session({ secret: 'keyboard cat', key: 'sid'}));      ///// Use session             
  app.use(passport.initialize());                               ///// Initialize passport
  app.use(passport.session());                                  ///// Initialize passprt session
  app.use(express.static(__dirname + '/public'));               //// Make the express know about the public directory

// Passport session setup.
passport.serializeUser(function(user, done) {                  ////// Serilaze user
  done(null, user);
});

passport.deserializeUser(function(obj, done) {                 ///// deserialize user
  done(null, obj);
});

// Use the FacebookStrategy within Passport.

passport.use(new FacebookStrategy({                              ///// add facebook config to passport facebook strategy
    clientID: process.env.facebook_api_key,
    clientSecret:process.env.facebook_api_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));




app.get('/', function(req, res){                            //// render the index.ejs
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));   //// authenticate facebook user


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }), //// authenticate facebook using callback
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){    //// logout of facebook or google
  req.logout();
  res.redirect('/');
});


function ensureAuthenticated(req, res, next) {        //// ensures whether the user is authenticated 
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
var userProfile;
app.get('/success', (req, res) => {                         //// show the sucess.ejs if user is logged in
  res.render('sucess', {user: userProfile});
});


const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;   //// Google auth statregy
const GOOGLE_CLIENT_ID = config.google_id;                                //// Google id
const GOOGLE_CLIENT_SECRET = process.env.google_client_secret;            //// Google client secret
passport.use(new GoogleStrategy({                                         //// Initialize passprt Google strategy
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));     //// authenticate google
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),         //// authenticate google using callback url 
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });


  app.get('/wordToPf',(req,res)=>{                                     //// Word to pdf converter route
    const extend = '.pdf'   
   const sourceFilePath = path.resolve('./public/Word_suresh.docx');
   const outputFilePath = path.resolve('./public/Word_suresh.pdf');
   docxConverter(sourceFilePath,outputFilePath,function(err,result){
      if(err){
        console.log(err);
     }
    res.render("pdfsucess");
   });

})
 

app.use("/OneToOneMongo",MongoOneToOneDBRoutes);       ////// MongoDB one to one CRUD OPERATION
app.use("/OneToManyMongo",MongoOneToManyDBRoutes);     ////// MongoDB one to many.


app.listen(port,()=>{
  console.log(` Server started at port ${port}`);
});
