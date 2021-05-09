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
      friendCount: 0,
    });
    await user.save();
    res
      .status(200)
      .json({ status: "success", data: user, message: "new User created" });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

userController.getUser = async (req, res, next) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json({
      success: true,

      data: allUsers,

      message: `All Users listed`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      error: err.message,
    });
  }
};

userController.getSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleUser = await User.findById(id);
    res.status(200).json({
      success: true,

      data: singleUser,

      message: `Author ${singleUser.name} found!`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      error: err.message,
    });
  }
};
userController.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const selectedUser = await Author.findByIdAndUpdate(
      id,
      { name: name },
      { new: true }
    );
    res.status(200).json({
      success: true,

      data: selectedUser,

      message: `Author ${selectedUser.name} updated!`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      error: err.message,
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

      error: err.message,
    });
  }
};
module.exports = userController;
