var express = require("express");
const reviewController = require("../controllers/review.controller");
const { loginRequired } = require("../middlewares/authentication");
var router = express.Router();

/**
 * @POST
 * create review in blog
 */
router.post("/blogs/:blog_id", loginRequired, reviewController.createReview);
/**
 * @GET
 * get all reviews in blog
 */
router.get("/blogs/:blog_id", reviewController.getReviews);
/**
 * @DELETE
 * delete review
 */
router.delete("/:review_id", loginRequired, reviewController.deleteReview);
/**
 * @PUT
 * Update review
 */
router.put("/:review_id", loginRequired, reviewController.updateReview);
module.exports = router;
