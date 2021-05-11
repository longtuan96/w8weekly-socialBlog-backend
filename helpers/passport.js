const FacebookTokenStrategy = require("passport-facebook-token");
const passport = require("passport");
const User = require("../models/user");
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET_KEY = process.env.FACEBOOK_APP_ID;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(err, user);
});
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: 432241858217550,
      clientSecret: "2f136a047ae4584fcd676513a56d4109",
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
module.exports = passport;
