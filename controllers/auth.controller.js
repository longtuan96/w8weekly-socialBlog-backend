const User = require("../models/user");
const bcrypt = require("bcrypt");
const authController = {};

authController.loginWithEmail = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({
      success: false,
      error: "Wrong email or password",
    });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({
      success: false,

      error: "Wrong email or password",
    });
};
authController.loginWithFacebookOrGoogle = async (req, res, next) => {
  try {
    const { user } = req;

    if (user) {
      user = await User.findByIdAndUpdate(
        user._id,
        { avatarUrl: user.avatarUrl }, //get recent avatar from facebook
        { new: true }
      );
    } else {
      throw new Error("login failed!");
    }
    const accessToken = await user.generateToken();
    res.status(200).json({ status: "success", data: user, accessToken });
  } catch (error) {}
};
module.exports = authController;
