var express = require("express");
var router = express.Router();
const userApi = require("./user.api");
const blogApi = require("./blog.api");

router.use("/user", userApi);
router.use("/blog", blogApi);

module.exports = router;
