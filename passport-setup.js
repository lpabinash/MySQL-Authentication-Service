const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID:"633576363398-alqk8qn763anuc68nsa2mjf4bepi3ksm.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:4000/google/callback",
    passReqToCallback:true,
    proxy:true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(profile)
    return done(null, profile);
  }
));