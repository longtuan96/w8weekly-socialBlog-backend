const express = require("express");
const router = express.Router();
const { loginRequired } = require("../middlewares/authentication");

const userController = require("../controllers/user.controller");
const { body, param } = require("express-validator");

/**
 * @route POST api/friends/add/:id
 * @description Send a friend request to an user
 * @access Login required
 */
router.post(
  "/add/:to_user_id",
  loginRequired,
  userController.sendFriendRequest
);

/**
 * @route DELETE api/friends/add/:id
 * @description Cancel a friend request to an user
 * @access Login required
 */
router.delete(
  "/add/:to_user_id",
  loginRequired,

  userController.cancelFriendRequest
);

/**
 * @route GET api/friends/add
 * @description Get the list of friend requests that are sent by the user
 * @access Login required
 */
router.get("/add", loginRequired, userController.getSentFriendRequestList);

/**
 * @route GET api/friends/manage
 * @description Get the list of received friend requests
 * @access Login required
 */
router.get(
  "/manage",
  loginRequired,
  userController.getReceivedFriendRequestList
);

/**
 * @route GET api/friends
 * @description Get the list of friends
 * @access Login required
 */
router.get("/", loginRequired, userController.getFriendList);

/**
 * @route POST api/friends/manage/:id
 * @description Accept a friend request from an user
 * @access Login required
 */
router.post(
  "/manage/:from_user_id",
  loginRequired,

  userController.acceptFriendRequest
);

/**
 * @route DELETE api/friends/manage/:id
 * @description Decline a friend request from an user
 * @access Login required
 */
router.delete(
  "/manage/:from_user_id",
  loginRequired,

  userController.declineFriendRequest
);

/**
 * @route DELETE api/friends/:id
 * @description Remove a friend
 * @access Login required
 */
router.delete(
  "/:friend_user_id",
  loginRequired,

  userController.removeFriendship
);

module.exports = router;
