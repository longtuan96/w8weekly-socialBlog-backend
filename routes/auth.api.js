const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * @POST
 * log in
 */
router.post("/login", authController.loginWithEmail);

// router.post(
//   "/login/facebook",
//   passport.authenticate("facebook-token"),
//   authController.loginWithFacebookOrGoogle
// );
module.exports = router;
