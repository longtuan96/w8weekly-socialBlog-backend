const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const User = require("../models/user");
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET_KEY = process.env.FACEBOOK_APP_SECRET_KEY;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(err, user);
});
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET_KEY,
      fbGraphVersion: "v3.0",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        {
          facebookId: profile.id,
          name: profile.displayName,
          email: profile.email[0].value,
          avatarUrl: profile.photos[0].value,
        },
        function (error, user) {
          return done(error, user);
        }
      );
    }
  )
);
