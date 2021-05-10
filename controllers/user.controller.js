const Friendship = require("../models/friendship");
const User = require("../models/user");

const userController = {};

userController.createUser = async (req, res, next) => {
  try {
    const { name, email, password, avatarUrl } = req.body;

    const user = new User({
      name,
      email,
      password,
      avatarUrl: avatarUrl || "",
    });
    await user.save();
    res
      .status(200)
      .json({ status: "success", data: { user }, message: "new User created" });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

userController.getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json({
      success: true,

      data: { users: allUsers },

      message: `All Users listed`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      error: error.message,
    });
  }
};

userController.getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.userId);
    res.status(200).json({
      success: true,

      data: currentUser,

      message: `user ${currentUser.name} found!`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      error: error.message,
    });
  }
};
userController.updateUser = async (req, res, next) => {
  try {
    const { name, avatarUrl } = req.body;
    const currentUser = await User.findById(req.userId);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        name: name || currentUser.name,
        avatarUrl: avatarUrl || currentUser.avatarUrl,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,

      data: updatedUser,

      message: `user ${updatedUser.name} updated!`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      error: error.message,
    });
  }
};

userController.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const selectedUser = await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,

      data: selectedUser,

      message: `Deleted author ${selectedUser.name}`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      error: error.message,
    });
  }
};

//Friendship methods

userController.sendFriendRequest = async (req, res, next) => {
  try {
    const userId = req.userId; // From
    const toUserId = req.params.to_user_id; // To

    const user = await User.findById(toUserId);

    let friendship = await Friendship.findOne({
      $or: [
        { from: toUserId, to: userId },
        { from: userId, to: toUserId },
      ],
    });
    if (!friendship) {
      await Friendship.create({
        from: userId,
        to: toUserId,
        status: "requesting",
      });
      res
        .status(200)
        .json({ status: "success", message: "friend request sent" });
    } else {
      switch (friendship.status) {
        case "requesting":
          if (friendship.from.equals(userId)) {
            res.status(400).json({
              status: "fail",
              message: "You have already sent a request to this user",
            });
          } else {
            res.status(400).json({
              status: "fail",
              message: "You have received a request from this user",
            });
          }
          break;
        case "accepted":
          res.status(400).json({
            status: "fail",
            message: "Users are already friend",
          });
          break;
        case "removed":
        case "decline":
        case "cancel":
          friendship.from = userId;
          friendship.to = toUserId;
          friendship.status = "requesting";
          await friendship.save();
          res
            .status(200)
            .json({ status: "success", message: "Friend request sent!" });
          break;
        default:
          break;
      }
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

userController.acceptFriendRequest = async (req, res, next) => {
  const userId = req.userId; // To
  const fromUserId = req.params.from_user_id; // From
  let friendship = await Friendship.findOne({
    from: fromUserId,
    to: userId,
    status: "requesting",
  });
  if (!friendship)
    res
      .status(404)
      .json({ status: "fail", message: "Friend Request not found" });
  friendship.status = "accepted";
  await friendship.save();
  let friendList = await Friendship.find({
    $or: [{ from: userId }, { to: userId }],
    status: "accepted",
  });
  await User.findByIdAndUpdate(userId, { friendCount: friendList.length });
  res
    .status(200)
    .json({ status: "success", message: "Friend request has been accepted" });
};

userController.declineFriendRequest = async (req, res, next) => {
  try {
    const userId = req.userId; // To
    const fromUserId = req.params.from_user_id; // From
    let friendship = await Friendship.findOne({
      from: fromUserId,
      to: userId,
      status: "requesting",
    });
    if (!friendship) {
      res.status(404).json({ status: "fail", message: "Request not found" });
    }
    friendship.status = "decline";
    await friendship.save();

    res
      .status(200)
      .json({ status: "success", message: "Friend request has been declined" });
  } catch (error) {}
};

userController.getFriendList = async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = { ...req.query };
  const userId = req.userId;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  let friendList = await Friendship.find({
    $or: [{ from: userId }, { to: userId }],
    status: "accepted",
  });

  const friendIDs = friendList.map((friendship) => {
    if (friendship.from._id.equals(userId)) return friendship.to;
    return friendship.from;
  });

  const totalFriends = await User.countDocuments({
    ...filter,

    _id: { $in: friendIDs },
  });
  const totalPages = Math.ceil(totalFriends / limit);
  const offset = limit * (page - 1);

  let users = await User.find({ ...filter, _id: { $in: friendIDs } })
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit);

  const promises = users.map(async (user) => {
    let temp = user.toJSON();
    temp.friendship = friendList.find((friendship) => {
      if (friendship.from.equals(user._id) || friendship.to.equals(user._id)) {
        return { status: friendship.status };
      }
      return false;
    });
    return temp;
  });
  const usersWithFriendship = await Promise.all(promises);
  res.status(200).json({
    status: "success",
    data: { users: usersWithFriendship, totalPages },
    message: "friends listed",
  });
};

userController.getSentFriendRequestList = async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = { ...req.query };
  const userId = req.userId;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  let requestList = await Friendship.find({
    from: userId,
    status: "requesting",
  });

  const recipientIDs = requestList.map((friendship) => {
    if (friendship.from._id.equals(userId)) return friendship.to;
    return friendship.from;
  });

  const totalRequests = await User.countDocuments({
    ...filter,
    isDeleted: false,
    _id: { $in: recipientIDs },
  });
  const totalPages = Math.ceil(totalRequests / limit);
  const offset = limit * (page - 1);

  let users = await User.find({ ...filter, _id: { $in: recipientIDs } })
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit);

  const promises = users.map(async (user) => {
    let temp = user.toJSON();
    temp.friendship = requestList.find((friendship) => {
      if (friendship.from.equals(user._id) || friendship.to.equals(user._id)) {
        return { status: friendship.status };
      }
      return false;
    });
    return temp;
  });
  const usersWithFriendship = await Promise.all(promises);
  res.status(200).json({
    status: "success",
    data: { users: usersWithFriendship, totalPages },
    message: "sent friend requests listed",
  });
};

userController.getReceivedFriendRequestList = async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = { ...req.query };
  const userId = req.userId;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  let requestList = await Friendship.find({
    to: userId,
    status: "requesting",
  });

  const requesterIDs = requestList.map((friendship) => {
    if (friendship.from._id.equals(userId)) return friendship.to;
    return friendship.from;
  });

  const totalRequests = await User.countDocuments({
    ...filter,
    isDeleted: false,
    _id: { $in: requesterIDs },
  });
  const totalPages = Math.ceil(totalRequests / limit);
  const offset = limit * (page - 1);

  let users = await User.find({ ...filter, _id: { $in: requesterIDs } })
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit);

  const promises = users.map(async (user) => {
    let temp = user.toJSON();
    temp.friendship = requestList.find((friendship) => {
      if (friendship.from.equals(user._id) || friendship.to.equals(user._id)) {
        return { status: friendship.status };
      }
      return false;
    });
    return temp;
  });
  const usersWithFriendship = await Promise.all(promises);
  res.status(200).json({
    status: "success",
    data: { users: usersWithFriendship, totalPages },
    message: "received friend requests listed",
  });
};

userController.cancelFriendRequest = async (req, res, next) => {
  try {
    const userId = req.userId; // From
    const toUserId = req.params.to_user_id; // To
    let friendship = await Friendship.findOne({
      from: userId,
      to: toUserId,
      status: "requesting",
    });
    if (!friendship)
      return next(
        res.status(404).json({ status: "fail", message: "Request not found" })
      );

    friendship.status = "cancel";
    await friendship.save();
    res.status(200).json({
      status: "success",
      message: "Friend request has been cancelled",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

userController.removeFriendship = async (req, res, next) => {
  const userId = req.userId;
  const toBeRemovedUserId = req.params.friend_user_id;
  let friendship = await Friendship.findOne({
    $or: [
      { from: userId, to: toBeRemovedUserId },
      { from: toBeRemovedUserId, to: userId },
    ],
    status: "accepted",
  });
  if (!friendship)
    res.status(404).json({ status: "fail", message: "Friend not found" });

  friendship.status = "removed";
  await friendship.save();
  await friendship.save();
  let friendList = await Friendship.find({
    $or: [{ from: userId }, { to: userId }],
    status: "accepted",
  });
  await User.findByIdAndUpdate(userId, { friendCount: friendList.length });
  res
    .status(200)
    .json({ status: "success", message: "Friendship has been removed" });
};
module.exports = userController;
