var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

const facebookVerify=async(id_token)=>{
    
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET_ID,
        callbackURL: "http://localhost:3000/api/auth/facebook",
        state:true
      },
      function(accessToken=id_token, refreshToken, profile, cb) {
        
        return cb(err, user);
        
      }
    ));

    
    passport.serializeUser(function(user, cb) {
        cb(null, user);
      });
    
      passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
      });
}



module.exports={
    facebookVerify
}


