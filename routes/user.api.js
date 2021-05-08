var express = require("express");
const userController = require("../controllers/user.controller");
var router = express.Router();

/**
 * @POST
 * create new user (register)
 */
router.post("/", userController.createUser);
/**
 * @GET
 * get user information
 */

/**
 * @GET
 * get all user
 */
router.get("/", userController.getUser);
/**
 * @UPDATE
 * change user profile
 */

module.exports = router;
