const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * @POST
 * log in
 */
router.post("/", authController.loginWithEmail);
module.exports = router;
