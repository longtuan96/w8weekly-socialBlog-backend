const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * @POST
 * log in
 */
router.post("/login", authController.loginWithEmail);
module.exports = router;
