var express = require("express");
const blogController = require("../controllers/blog.controller");
var router = express.Router();

/**
 * @POST
 * create new blog
 */
router.post("/", blogController.createBlog);
/**
 * @GET
 * get user information
 */

/**
 * @GET
 * get all blogs
 */

/**
 * @UPDATE
 * change user profile
 */

module.exports = router;
