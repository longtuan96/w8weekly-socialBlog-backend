var express = require("express");
const blogController = require("../controllers/blog.controller");
const { loginRequired } = require("../middlewares/authentication");
var router = express.Router();
const reviewApi = require("./review.api");

router.use("/reviews", reviewApi);
/**
 * @POST
 * create new blog
 */
router.post("/", loginRequired, blogController.createBlog);
/**
 * @GET
 * get current user's blog
 */
router.get("/own", loginRequired, blogController.getMyBlogs);
/**
 * @GET
 * get all blogs
 */
router.get("/", blogController.getBlogs);

/**
 * @GET
 * get single blog
 */
router.get("/:blog_id", blogController.getSingleBlog);
/**
 * @UPDATE
 * change user profile
 */
router.put("/:blog_id", loginRequired, blogController.updateBlog);
/**
 * @DELETE
 * delete a blog
 */
router.delete("/:blog_id", loginRequired, blogController.deleteBlog);

module.exports = router;
