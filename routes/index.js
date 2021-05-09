var express = require("express");
var router = express.Router();
const userApi = require("./user.api");
const blogApi = require("./blog.api");
const reactionApi = require("./reaction.api");
const authApi = require("./auth.api");
const reviewApi = require("./review.api");
router.use("/user", userApi);
router.use("/blogs", blogApi);
router.use("/reaction", reactionApi);
router.use("/login", authApi);
router.use("/reviews", reviewApi);
module.exports = router;
