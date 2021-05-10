var express = require("express");
const userController = require("../controllers/user.controller");
var router = express.Router();
const { loginRequired } = require("../middlewares/authentication");
/**
 * @POST
 * create new user (register)
 */
router.post("/", userController.createUser);
/**
 * @GET
 * get current user information
 */
router.get("/me", loginRequired, userController.getCurrentUser);
/**
 * @GET
 * get all user
 */
router.get("/", userController.getUsers);
/**
 * @UPDATE
 * change user profile
 */
router.put("/", loginRequired, userController.updateUser);
module.exports = router;
