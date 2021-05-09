var express = require("express");
const reactionController = require("../controllers/reaction.controller");
const { loginRequired } = require("../middlewares/authentication");
var router = express.Router();

/**
 * @PUT
 * choose reaction
 */
router.put("/", loginRequired, reactionController.chooseReaction);

module.exports = router;
