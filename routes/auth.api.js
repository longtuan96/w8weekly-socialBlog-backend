const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * @POST
 * log in
 */
router.post("/login", authController.loginWithEmail);

router.post(
  "/login/facebook",
  (req, res) => {
    passport.authenticate("facebook-token", function (err, user, info) {
      if (err) {
        if (err.oauthError) {
          var oauthError = JSON.parse(err.oauthError.data);
          res.send(oauthError.error);
        } else {
          res.send(err);
        }
      } else {
        res.send(user);
      }
    })(req, res);
  },
  authController.loginWithFacebookOrGoogle
);
module.exports = router;
